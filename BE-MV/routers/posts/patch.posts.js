const express = require("express");
const router = express.Router();
const { posts } = require("../../models")
const { users } = require("../../models")

const editPosts = async (req, res, next) => {
    try {
        const { post_id } = req.params;
        const { caption } = req.body;
        
        const resUpdatePost = await posts.update({
            caption: caption
        },
        {
            where: {post_id}
        }
    );

    res.send({
        status: "success",
        message: "success update post"
    })

    } catch (error) {
        console.log(error);
        next(error)
    }
}

router.patch("/:post_id", editPosts)

module.exports = router;