const express = require("express");
const router = express.Router();
const { posts } = require("../../models");
const { users } = require("../../models");
const { Op, Sequelize } = require("sequelize");
const getPostsBySearch = async (req, res, next) => {
  try {
    const search = req.params.search;
    const resSearch = await posts.findAll({
      where: {
        caption: {
          [Op.like]: `%${search}%`,
        },
      },
    });
    res.send({
      status: "Success",
      message: "Success get search post",
      data: resSearch,
    });
  } catch (error) {
    next(error);
  }
};

const getPosts = async (req, res, next) => {
  try {
    let { page, pageSize } = req.query;

    page = +page;
    pageSize = +pageSize;

    const limit = pageSize;
    const offset = (page - 1) * pageSize;

    const resGetPosts = await posts.findAll({
      raw: true,
      order: [["createdAt", "DESC"]],
      limit: limit,
      offset: offset,
    });

    const mappedUser = resGetPosts.map((post) => {
      return post.user_id;
    });

    const userFound = [];

    for (const user_id of mappedUser) {
      const getPostUser = await users.findOne({ where: { user_id } });
      userFound.push(getPostUser.username);
    }

    const resPostUser = resGetPosts.map((post, index) => {
      post.username = userFound[index];
      return post;
    });

    res.send({
      status: "Success",
      message: "Success get all post",
      data: resGetPosts,
    });
  } catch (error) {
    console.log(error);
    next(error);
  }
};

const getPost = async (req, res, next) => {
  try {
    const { post_id } = req.params;

    const resGetPost = await posts.findOne({
      where: { post_id },
    });
    console.log(resGetPost.dataValues.user_id);
    const { user_id } = resGetPost.dataValues;
    const resGetPoster = await users.findOne({
      where: { user_id },
    });

    res.send({
      status: "Success",
      message: "Success get user and post",
      data: resGetPost,
      resGetPoster,
    });
  } catch (error) {
    console.log(error);
    next(error);
  }
};

router.get("/", getPosts);
router.get("/getPost/:post_id", getPost);
router.get("/getPostsBySearch/:search", getPostsBySearch);

module.exports = router;
