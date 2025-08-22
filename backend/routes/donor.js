const { Router } = require("express");
const { Donor, List, Food, DonorDelivery } = require("../db/mongo");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const { validateUserMiddleware } = require("../middlewares/validateUser");
const router = Router();
const SECRET = process.env.SECRET;

// router to sign the user up
router.post("/signup", async (req, res) => {
  const { name, email, password, city, phoneNo, organization, certificate } =
    req.body;

  try {
    const hashedPassword = await bcrypt.hash(password, 10);
    const donor = new Donor({
      name,
      email,
      password: hashedPassword,
      city,
      phoneNo,
      organization,
      certificate,
    });
    const donorId = await donor.save();

    // creating listSchema here
    const list = new List({
      donor: donorId,
      foods: [],
    });
    await list.save();
    res.status(201).json({ message: "Donor registered successfully" });
  } catch (err) {
    res.status(401).json({ error: "Registration failed" });
  }
});

// router to sign the user in
router.post("/signin", async (req, res) => {
  const { email, password } = req.body;

  try {
    const donor = await Donor.findOne({ email });

    if (!donor) {
      return res.status(401).json({ error: "Authentication failed" });
    }

    const passwordMatch = await bcrypt.compare(password, donor.password);
    if (!passwordMatch) {
      return res.status(401).json({ error: "Password doesn't match" });
    }

    const token = jwt.sign({ email: donor.email }, SECRET, {
      expiresIn: "24h",
    });
    res.status(200).json({
      status: "Logged In",
      token,
      id: donor._id,
      type: "donor",
    });
  } catch (err) {
    res.status(401).json({ status: "Sign In Failed" });
  }
});

// router to list food
router.post("/listfood", validateUserMiddleware, async (req, res) => {
  const foodCart = req.body.foodCart;

  try {
    if (!foodCart || foodCart.length === 0) {
      return res.status(400).json({ error: "Food cart is empty" });
    }

    // take donorId, phoneNo, pickupLocation from first item
    const { donorId, phoneNo, pickupLocation } = foodCart[0];

    // create ONE delivery object
    let delivery = new DonorDelivery({
      donor: donorId,
      foods: [],
      location: pickupLocation,
      phoneNo,
    });
    await delivery.save();

    for (const obj of foodCart) {
      const { name, type, quantity, expiryTime } = obj;

      // ensure quantity is number
      const quantityNum = Number(quantity);

      // create food item
      const food = new Food({
        name,
        type,
        quantity: quantityNum,
        pickupLocation,
        expiryTime,
      });
      const foodinfo = await food.save();

      // push into donor's list
      await List.updateOne(
        { donor: donorId },
        { $push: { foods: foodinfo._id } }
      );

      // update donor stats
      await Donor.updateOne(
        { _id: donorId },
        { $inc: { totalMeals: 1, totalQuantity: quantityNum } }
      );

      // add food to this delivery
      delivery.foods.push(foodinfo._id);
    }

    // save delivery with all food references
    await delivery.save();

    res.status(200).json({ status: "Food Listed Successfully" });
  } catch (err) {
    res
      .status(404)
      .json({ status: "Error while listing foods", error: err.message });
  }
});

// router to get donor dashboard
router.get("/dashboard", validateUserMiddleware, async (req, res) => {
  const { donorId } = req.body;

  try {
    const donor = await Donor.findById(donorId);
    if (!donor) return res.status(401).json("No user found");

    const listing = await List.findOne({ donor: donorId })
      .populate("foods")
      .exec();

    if (!listing) {
      return res.status(200).json({
        totalQuantity: donor.totalQuantity,
        totalMeals: donor.totalMeals,
        foodItems: [],
      });
    }

    // group foods by type
    const foodSummary = {};
    listing.foods.forEach((food) => {
      if (!foodSummary[food.type]) {
        foodSummary[food.type] = 0;
      }
      foodSummary[food.type] += food.quantity;
    });

    res.status(200).json({
      totalQuantity: donor.totalQuantity,
      totalMeals: donor.totalMeals,
      foodItems: foodSummary,
    });
  } catch (err) {
    res.status(500).json({ status: `Error while fetching details: ${err}` });
  }
});

router.get("/delivery", validateUserMiddleware, async (req, res) => {
  const { donorId } = req.body; // gets donorId from the backend

  try {
    const deliveries = await DonorDelivery.find({ donor: donorId })
      .populate("foods") // populate the food items
      .exec();

    if (!deliveries || deliveries.length === 0) {
      return res.status(200).json({ deliveries: [] });
    }

    // shape the response
    const response = deliveries.map((delivery) => ({
      deliveryId: delivery._id,
      location: delivery.location,
      phoneNo: delivery.phoneNo,
      foodItems: delivery.foods.map((food) => ({
        id: food._id,
        name: food.name,
        type: food.type,
        quantity: food.quantity,
        pickupLocation: food.pickupLocation,
        expiryTime: food.expiryTime,
      })),
    }));

    res.status(200).json({ deliveries: response });
  } catch (err) {
    res
      .status(500)
      .json({ status: "Error while fetching deliveries", error: err.message });
  }
});

module.exports = router;
