const express =  require("express");
const router = express.Router();

const postLikesRouter = require("./post.likes")
const getLikesRouter = require("./get.likes")
const deleteLikesRouter = require("./delete.likes")

router.use(postLikesRouter);
router.use(getLikesRouter);
router.use(deleteLikesRouter);

module.exports = router;