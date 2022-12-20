const express = require("express");
const router = express.Router();
const { users } = require("../../models");
const { Op } = require("sequelize");
const { hash, compare } = require("../../src/lib/bcryptjs");
const { createToken } = require("../../src/lib/token");

const postUser = async (req, res, next) => {
  try {
    console.log("jalan");
    const { username, email, password } = req.body;
    const resFindUser = await users.findOne({
      where: { [Op.or]: { username, email } },
    });
    console.log(`ini resfinduser ${resFindUser}`);
    if (resFindUser) {
      console.log(resFindUser);

      const resUser = resFindUser.dataValues.username;
      const resEmail = resFindUser.dataValues.email;
      const resLowerUser = resUser.toLowerCase();
      const resLowerEmail = resEmail.toLowerCase();
      const usernameLower = username.toLowerCase();
      const emailLower = email.toLowerCase();

      if (resLowerUser == usernameLower || resLowerEmail == emailLower) {
        throw {
          code: 400,
          message: "username or email already exists",
          detail: {
            databaseUsername: resFindUser,
            currentClientEmail: email,
            currentClientUsername: username,
          },
          errorType: "username",
        };
      }
    }

    const encryptedPassword = hash(password);
    const resCreateNewUser = await users.create({
      username,
      email,
      password: encryptedPassword,
    });

    const token = createToken({
      user_id: resCreateNewUser.dataValues.user_id,
    });

    const patchToken = await users.findOne({
      where: { user_id: resCreateNewUser.dataValues.user_id },
    });
    await patchToken.update({
      user_token: token,
    });
    const resPatchToken = await patchToken.save();

    console.log(`ini token yaaa ==> ${token}`);
  } catch (error) {
    next(error);
  }
};

const loginUser = async (req, res, next) => {
  try {
    const { email, password } = req.body;
    const resFindUser = await users.findOne({
      where: { email },
    });

    if (resFindUser) {
      const user = resFindUser.dataValues;

      const isPasswordMatch = compare(password, user.password);
      if (!isPasswordMatch) {
        throw {
          code: 401,
          message: `Password or email is incorrect`,
        };
      }

      const token = createToken({
        user_id: user.user_id,
        username: user.username,
      });

      res.send({
        status: "success",
        message: "login success",
        data: {
          result: {
            user_id: user.user_id,
            email: user.email,
            username: user.username,
            accesstoken: token,
          },
        },
      });
    } else {
      throw {
        code: 405,
        message: "incorrect email or password",
        errorType: "Incorrect Login",
      };
    }
  } catch (error) {
    next(error);
  }
};

router.post("/register", postUser);
router.post("/login", loginUser);

module.exports = router;
