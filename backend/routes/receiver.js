const { Router } = require("express");
const { Receiver, Food, DonorDelivery } = require("../db/mongo");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const { validateUserMiddleware } = require("../middlewares/validateUser");
const router = Router();
const SECRET = process.env.SECRET;

// router to sign the user up
router.post("/signup", async (req, res) => {
  const { name, email, password, city, phoneNo, receiverType, certificate } =
    req.body;

  try {
    const hashedPassword = await bcrypt.hash(password, 10);
    const receiver = new Receiver({
      name,
      email,
      password: hashedPassword,
      city,
      phoneNo,
      receiverType,
      certificate,
      verified,
    });
    await donor.save();
    res.status(201).json({ message: "Receiver registered successfully" });
  } catch (err) {
    res.status(401).json({ error: "Registration failed" });
  }
});

// router to signin the user up
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

module.exports = router;
