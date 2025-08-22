const { Router } = require("express");
const { Donor, List, Food } = require("../db/mongo");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const { validateUserMiddleware } = require("../middlewares/validateUser");
const router = Router();
const SECRET = process.env.SECRET;

// router to sign the user up
router.post("/signup", async (req, res) => {
  const name = req.body.name;
  const email = req.body.email;
  const password = req.body.password;
  const city = req.body.city;
  const phoneNo = req.body.phoneNo;
  const organization = req.body.organization;
  const certificate = req.body.certificate;

  try {
    const hashedPassword = await bcrypt.hash(password, 10);
    const donor = new Donor({
      name: name,
      email: email,
      password: hashedPassword,
      city: city,
      phoneNo: phoneNo,
      organization: organization,
      certificate: certificate,
    });
    await donor.save();
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

    // if there is no donor return
    if (!donor) {
      return res.status(401).json({ error: "Authentication failed" });
    }

    // match password
    const passwordMatch = await bcrypt.compare(password, donor.password);

    // if the password doesn't match return error
    if (!passwordMatch) {
      return res.status(401).json({ error: "Password doesn't match" });
    }

    // sets the token validity with the donorId
    const token = jwt.sign({ email: donor.email }, SECRET, {
      expiresIn: "1h",
    });
    res
      .status(200)
      .json({
        status: "Logged In",
        token: token,
        id: donor._id,
        type: "donor",
      });
  } catch (err) {
    res.status(401).json({ status: "Sign In Failed" });
  }
});

// router to list food
router.post("/listfood", validateUserMiddleware, async (req, res) => {});

module.exports = router;
