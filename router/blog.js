const { Router } = require("express");
const multer = require("multer");
const path = require("path");
const Blog = require("../models/blog");
const Comment = require("../models/comment");

const router = Router();

router.get("/add-new", (req, res) => {
  return res.render("addBlog", {
    user: req.user,
  });
});

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    return cb(null, path.resolve(`./public/uploads`));
  },
  filename: function (req, file, cb) {
    const filename = `${Date.now()}-${file.originalname}`;

    return cb(null, filename);
  },
});

const upload = multer({ storage });

router.get("/:id", async (req, res) => {
  const blog = await Blog.findById(req.params.id).populate("createdBy");
  const comments = await Comment.find({ blogID: req.params.id }).populate(
    "createdBy"
  );

  return res.render("blog", {
    user: req.user,
    blog,
    comments,
  });
});

router.post("/", upload.single("coverImage"), async (req, res) => {
  const { title, body } = req.body;
  const blog = await Blog.create({
    body,
    title,
    createdBy: req.user._id,
    coverImageURL: `/uploads/${req.file.filename}`,
  });

  return res.redirect(`/blog/${blog._id}`);
});

router.post("/comment/:blogID", async (req, res) => {
  await Comment.create({
    content: req.body.content,
    blogID: req.params.blogID,
    createdBy: req.user._id,
  });
  return res.redirect(`/blog/${req.params.blogID}`);
});
// In your router file (e.g., blog.js or routes/blog.js)

router.post("/blog/comments/:commentId/replies", async (req, res) => {
  const { commentId } = req.params;
  const { content } = req.body;

  if (!req.user) {
    return res.redirect("/login"); // Ensure the user is logged in
  }

  try {
    const comment = await Comment.findById(commentId);
    if (!comment) {
      return res.status(404).send("Comment not found.");
    }

    // Add the reply to the comment
    comment.replies.push({
      content,
      createdBy: req.user._id,
    });

    await comment.save();
    res.redirect(`/blog/${comment.blogId}`); // Redirect back to the blog post
  } catch (error) {
    console.error(error);
    res.status(500).send("Server error.");
  }
});

module.exports = router;
