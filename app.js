require("dotenv").config();

const express = require("express");
const path = require("path");
const mongoose = require("mongoose");
const cookieParser = require("cookie-parser");

const rating = require("./router/rating");
const userRouter = require("./router/user");
const blogRouter = require("./router/blog");

const {
  checkForAuthenticationCookie,
} = require("./middlewares/authentication");
const Blog = require("./models/blog"); // Import Blog model

const app = express();
const PORT = process.env.PORT;

mongoose
  .connect(process.env.MONGO_URL)
  .then(() => console.log("Connected to MongoDB"))
  .catch((error) => console.error("MongoDB connection error:", error));

app.set("view engine", "ejs");
app.set("views", path.resolve("./views"));

app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(checkForAuthenticationCookie("token"));
app.use(express.static(path.resolve("./public")));
app.use(express.json());

app.use("/api/rating", rating);

app.get("/", async (req, res) => {
  try {
    const allBlogs = await Blog.find({}).sort({ createdAt: -1 });
    res.render("home", { user: req.user, blogs: allBlogs });
  } catch (error) {
    console.error("Error fetching blogs:", error);
    res.status(500).send("Error fetching blogs");
  }
});

app.use("/user", userRouter);
app.use("/blog", blogRouter);

app.listen(PORT, () => {
  console.log(`Server is running on PORT: ${PORT}`);
});
