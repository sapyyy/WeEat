const express = require("express");
const dotenv = require("dotenv");
const app = express();
dotenv.config();

const PORT = process.env.PORT || 3000;

app.use(express.json());

app.listen(PORT, () => {
  console.log(`Server is running on port number : ${PORT}`);
});

// default route s
app.use((req, res) => {
  res.status(404).json({ status: "Bad Request" });
});
