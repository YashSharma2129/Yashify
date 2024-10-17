const express = require("express");
const path = require("path");
const mongoose = require("mongoose");

const app = express();

const PORT = 3000;
mongoose
  .connect("mongodb://localhost:27017/Yashify")
  .then(() => console.log("Connected to MongoDB"));

const userRouter = require("./router/user");

app.use(express.urlencoded({ extended: false }));
app.use("/user", userRouter);

app.set("view engine", "ejs");
app.set("views", path.resolve("./views"));

app.get("/", (req, res) => {
  res.render("home");
});

app.listen(PORT, () => {
  console.log(`Server is running on PORT: ${PORT}`);
});
