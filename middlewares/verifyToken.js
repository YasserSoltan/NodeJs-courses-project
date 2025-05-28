const jwt = require("jsonwebtoken");
const appError = require("../utils/appError");
const httpStatusText = require("../utils/httpStatusText");

const verifyToken = (req, res, next) => {
  const authHeader = req.headers.authorization || req.headers.Authorization;
  const token = authHeader?.split(" ")[1];
  if (!token) {
    const error = appError.create(
      "No token provided.",
      401,
      httpStatusText.ERROR
    );
    return next(error);
  }

  try {
    const decodedToken = jwt.verify(token, process.env.JWT_SECRET_KEY);
    req.user = decodedToken;
    next();
  } catch (err) {
    const error = appError.create(
      "Invalid or expired token.",
      401,
      httpStatusText.ERROR
    );
    return next(error);
  }
};
module.exports = verifyToken;
