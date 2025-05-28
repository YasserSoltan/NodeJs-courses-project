const jwt = require("jsonwebtoken");

module.exports = async (payload, jwtExpire) => {
  const token = await jwt.sign(payload, process.env.JWT_SECRET_KEY, {
    expiresIn: jwtExpire || "1h",
  });

  return token;
};
