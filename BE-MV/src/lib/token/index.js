const jwt = require("jsonwebtoken");
const SECRET_WORD = "strong_mountain";

const createToken = (payload) =>
  jwt.sign(payload, SECRET_WORD, { expiresIn: "1h" });
const verifyToken = (token) =>
  jwt.verify(token, SECRET_WORD, function (err, decoded) {
    if (err) {
      return "expired";
    } else {
      console.log("verify token success");
    }
  });

module.exports = { createToken, verifyToken };
