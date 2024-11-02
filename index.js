const express = require("express");
const path = require("path");
const mongoose = require("mongoose");
const cookieParser = require("cookie-parser");
const blog = require("./models/blog");

const userRouter = require("./router/user");
const blogRouter = require("./router/blog");

const app = express();
const PORT = 3000;

const {
  checkForAuthenticationCookie,
} = require("./middlewares/authentication");

mongoose
  .connect("mongodb://localhost:27017/Yashify")
  .then(() => console.log("Connected to MongoDB"));

app.set("view engine", "ejs");
app.set("views", path.resolve("./views"));

app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(checkForAuthenticationCookie("token"));
app.use(express.static(path.resolve("./public")));

app.get("/", async (req, res) => {
  const allBlogs = await blog.find({}).sort({ createdAt: -1 });
  res.render("home", { user: req.user, blogs: allBlogs });
});

app.use("/user", userRouter);
app.use("/blog", blogRouter);

app.listen(PORT, () => {
  console.log(`Server is running on PORT: ${PORT}`);
});
