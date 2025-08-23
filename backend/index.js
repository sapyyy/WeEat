const dotenv = require("dotenv");
dotenv.config();
const express = require("express");
const app = express();
const donorRouter = require("./routes/donor");
const cors = require("cors");

const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());

app.listen(PORT, () => {
  console.log(`Server is running on port number : ${PORT}`);
});

app.use("/donor", donorRouter);

// default routes
app.use((req, res) => {
  res.status(404).json({ status: "Bad Request" });
});
