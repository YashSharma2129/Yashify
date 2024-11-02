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
  try {
    const { email, password } = req.body;
    console.log(email, password);
    const token = await User.matchPasswordAndGenerateToken(email, password);

    res.cookie("token", token).redirect("/");
  } catch (error) {
    return res.render("signin", {
      error: "Incorrect Email or Password",
    });
  }
});

router.get("/logout", async (req, res) => {
  res.clearCookie("token").redirect("/");
});

module.exports = router;
