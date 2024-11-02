const { Router } = require("express");
const multer = require("multer");
const path = require("path");
const Blog = require("../models/blog");

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

module.exports = router;
