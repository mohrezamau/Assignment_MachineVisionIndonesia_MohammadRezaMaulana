const express = require("express");
const router = express.Router();
const { likes } = require("../../models")

const getLikes = async (req, res, next) => {
   try {
    const { post_id } = req.params

    const resGetLikes = await likes.findAll({
        where: {post_id}
    })

    res.send({
        status: "success",
        message: "success get like"
        , data: resGetLikes
    })
   } catch (error) {
    next (error)
   }
}

router.get("/:post_id", getLikes)

module.exports = router;