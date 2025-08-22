const dotenv = require("dotenv");
dotenv.config();
const express = require("express");
const app = express();
const donorRouter = require("./routes/donor");

const PORT = process.env.PORT || 3000;

app.use(express.json());

app.listen(PORT, () => {
  console.log(`Server is running on port number : ${PORT}`);
});

app.use("/donor", donorRouter);

// default route s
app.use((req, res) => {
  res.status(404).json({ status: "Bad Request" });
});
