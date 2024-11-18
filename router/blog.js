const { Router } = require("express");
const multer = require("multer");
const path = require("path");
const Blog = require("../models/blog");
const Comment = require("../models/comment");
const { checkForAuthenticationCookie } = require("../middlewares/authentication");

const router = Router();

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, path.resolve("./public/uploads"));
  },
  filename: (req, file, cb) => {
    const filename = `${Date.now()}-${file.originalname}`;
    cb(null, filename);
  }
});

const upload = multer({ storage });

router.get("/add-new", (req, res) => {
  res.render("addBlog", { user: req.user });
});

router.get("/:id", async (req, res) => {
  try {
    const blog = await Blog.findById(req.params.id).populate("createdBy");
    const comments = await Comment.find({ blogID: req.params.id })
      .populate("createdBy")
      .populate({
        path: "replies.createdBy",
        model: "User"
      });

    res.render("blog", { user: req.user, blog, comments });
  } catch (error) {
    console.error(error);
    res.status(500).send("Server Error");
  }
});

router.post("/", upload.single("coverImage"), async (req, res) => {
  const { title, body } = req.body;
  const blog = await Blog.create({
    title,
    body,
    createdBy: req.user._id,
    coverImageURL: `/uploads/${req.file.filename}`
  });

  res.redirect(`/blog/${blog._id}`);
});

router.post("/comment/:blogID", async (req, res) => {
  await Comment.create({
    content: req.body.content,
    blogID: req.params.blogID,
    createdBy: req.user._id
  });

  res.redirect(`/blog/${req.params.blogID}`);
});

router.post("/comments/:id/replies", async (req, res) => {
  try {
    const comment = await Comment.findById(req.params.id);
    if (!comment) return res.status(404).send("Comment not found");

    if (!req.user) return res.status(401).send("Unauthorized");

    const reply = {
      content: req.body.content,
      createdBy: req.user._id
    };

    comment.replies.push(reply);
    await comment.save();

    res.redirect(`/blog/${comment.blogID}`);
  } catch (error) {
    console.error(error);
    res.status(500).send("Server Error");
  }
});

module.exports = router;
