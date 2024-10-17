const JWT = require("jsonwebtoken");
const User = require("../models/user");

const secret = "$Yash";

function createTokenForUser(user) {
  const payload = {
    _id: user._id,
    email: user.email,
    profileImageURL: user.profileImageURL,
    role: user.role,
  };

  const token = JWT.sign(payload, secret); // Move this outside of the nested function
  console.log("Payload:", payload);
  console.log("Generated token inside function:", token);

  return token; // Ensure the token is returned
}

function validateToken(token) {
  const payload = JWT.verify(token, secret);
  return payload;
}

module.exports = {
  createTokenForUser,
  validateToken,
};
