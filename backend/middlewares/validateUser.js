const jwt = require("jsonwebtoken");
const SECRET = process.env.SECRET;

// middleware to validate the admin
function validateUserMiddleware(req, res, next) {
  const authVal = req.headers.authorization; // the bearer is received here
  const token = authVal.split(" ")[1]; // the token is splitted here
  const verified = jwt.verify(token, SECRET);

  if (!verified) return res.status(401).json({ error: "Access Denied" });
  try {
    const decoded = jwt.verify(token, SECRET);
    req.id = decoded.id;
    next();
  } catch (err) {
    res.status(401).json({ error: "Invalid Token" });
  }
}

module.exports = {
  validateUserMiddleware,
};
