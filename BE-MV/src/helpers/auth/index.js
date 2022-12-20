const { users, posts } = require("../../../models");
const { verifyToken } = require("../../lib/token");

const auth = async (req, res, next) => {
  try {
    const token = req.token;

    const verifiedToken = verifyToken(token);
    console.log(verifiedToken);

    if (verifiedToken == "expired") {
      throw {
        code: 405,
        message: "token has expired",
        errorType: "token expired",
      };
    }

    const resGetUser = await users.findAll({
      attributes: ["user_id", "username"],
      where: verifiedToken.user_id,
    });

    if (!resGetUser.length) throw { message: "User not found" };

    const { user_id, username } = resGetUser[0];
    req.user = { user_id, username };

    next();
  } catch (error) {
    next(error);
  }
};

module.exports = { auth };
