const { Router } = require("express");
const User = require("../models/user");

const router = Router();

router.get("/signin", (req, res) => {
  res.render("signin");
});

router.get("/signup", (req, res) => {
  res.render("signup");
});

router.post("/signup", async (req, res) => {
  const { FullName, email, password } = req.body;
  await User.create({ FullName, email, password });

  res.redirect("/");
});

router.post("/signin", async (req, res) => {
  const { email, password } = req.body;
  console.log(email, password);
  const token = await User.matchPasswordAndGenerateToken(email, password);

  console.log("token",token);
  res.redirect("/");
});

module.exports = router;
