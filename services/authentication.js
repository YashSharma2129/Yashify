const JWT = require("jsonwebtoken");
const User = require("../models/user");

const secret = "$Yash";

function createTokenForUser(user) {
  const payload = {
    FullName: user.FullName,
    _id: user._id,
    email: user.email,
    profileImageURL: user.profileImageURL,
    role: user.role,
  };

  const token = JWT.sign(payload, secret);
  return token;
}

function validateToken(token) {
  const payload = JWT.verify(token, secret);
  return payload;
}

module.exports = {
  createTokenForUser,
  validateToken,
};
