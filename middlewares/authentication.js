const { validateToken } = require("../services/authentication");

function checkForAuthenticationCookie(cookieName) {
  return (req, res, next) => {
    const tokenCookieValue = req.cookies[cookieName];

    if (!tokenCookieValue) {
      req.user = null; // Explicitly set req.user to null if no token
      return next();
    }

    try {
      const userPayload = validateToken(tokenCookieValue);
      req.user = userPayload; // Attach user data (e.g., _id, FullName, etc.)
    } catch (error) {
      console.error("Token validation failed:", error.message);
      req.user = null; // Ensure req.user is null if token validation fails
    }

    return next();
  };
}

module.exports = { checkForAuthenticationCookie };
