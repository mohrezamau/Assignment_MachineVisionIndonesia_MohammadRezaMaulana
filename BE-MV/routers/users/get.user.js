const express = require("express");
const router = express.Router();
const { users } = require("../../models");
const { verifications } = require("../../models");
const { verifyToken } = require("../../src/lib/token");

const getUser = async (req, res, next) => {
  try {
    const { user_id } = req.params;

    const resGetUser = await users.findOne({
      where: { user_id },
    });

    const { dataValues } = resGetUser;

    res.send({ dataValues });
  } catch (error) {
    console.log(error);
    res.send(error);
  }
};

const getUserProfileController = async (req, res, next) => {
  try {
    const { user_id } = req.params;
    console.log(req.params);
    const resGetUser = await users.findAll({
      attributes: [
        "user_id",
        "username",
        "isVerified",
        "fullname",
        "bio",
        "email",
        "avatar",
      ],
      where: { user_id },
    });

    if (!resGetUser.length) throw { message: "User not found" };
    console.log(resGetUser);
    res.send({
      status: "Success",
      message: "User Profile",
      data: {
        result: resGetUser[0],
      },
    });
  } catch (error) {
    next(error);
  }
};

router.get("/", getUser);
router.get("/profile/:user_id", getUserProfileController);

module.exports = router;
