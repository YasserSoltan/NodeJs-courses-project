const appError = require("../utils/appError");
const httpStatusText = require("../utils/httpStatusText");

module.exports = (...roles) => {
  return (req, res, next) => {
    if (!req.user) {
      return res.status(403).json({
        status: "error",
        message: "Forbidden: User not authenticated.",
      });
    }
    if (!roles.includes(req.user.role)) {
        console.log(req.user.role, roles);
      return next(
        appError.create(
          "You do not have permission to perform this action.",
          403,
          httpStatusText.ERROR
        )
      );
    }
    next();
  };
};
