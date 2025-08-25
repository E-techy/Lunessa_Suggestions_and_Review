const jwt = require("jsonwebtoken");

/**
 * Middleware to authenticate user using JWT.
 *
 * - Extracts JWT token from `Authorization` header (Bearer <token>) or cookies.
 * - If token is valid:
 *    - Sets `req.body.username` from token
 *    - Sets `req.body.userType = "authenticUser"`
 * - If token is invalid/expired or not provided:
 *    - Sets `req.body.username = "Anonymous"`
 *    - Sets `req.body.userType = "unknownUser"`
 * - Always calls next(), never blocks request
 *
 * @param {import("express").Request} req - Express request object
 * @param {import("express").Response} res - Express response object
 * @param {import("express").NextFunction} next - Express next middleware function
 */
function authenticateUser(req, res, next) {
  try {
    // Get token from Authorization header or cookies
    const authHeader = req.headers["authorization"];
    const token =
      (authHeader && authHeader.startsWith("Bearer ") && authHeader.split(" ")[1]) ||
      (req.cookies && req.cookies.authToken);

    if (!req.body) req.body = {};

    if (!token) {
      // No token → mark as Anonymous
      req.body.username = "Anonymous";
      req.body.userType = "unknownUser";
      return next();
    }

    try {
      // Verify token
      const decoded = jwt.verify(token, process.env.JWT_SECRET_KEY);
      console.log("✅ Decoded JWT:", decoded);

      if (decoded.username) {
        req.body.username = decoded.username;
        req.body.userType = "authenticUser";
      } else {
        req.body.username = "Anonymous";
        req.body.userType = "unknownUser";
      }
    } catch (err) {
      // Invalid/expired token → fallback to Anonymous
      req.body.username = "Anonymous";
      req.body.userType = "unknownUser";
    }

    next();
  } catch (err) {
    // Failsafe
    req.body.username = "Anonymous";
    req.body.userType = "unknownUser";
    next();
  }
}

module.exports = authenticateUser;
