const express =  require("express");
const router = express.Router();


const postPostsRouter = require("./post.posts");
const getPostsRouter = require("./get.posts")
const patchPostsRouter = require("./patch.posts")
const deletePostsRouter = require("./delete.posts")


router.use(postPostsRouter);
router.use(getPostsRouter);
router.use(patchPostsRouter);
router.use(deletePostsRouter);


module.exports = router;