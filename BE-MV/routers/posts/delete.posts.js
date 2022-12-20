const express = require("express");
const router = express.Router();
const { posts } = require("../../models")
const { users } = require("../../models")

const deletePost = async (req, res, next) => {
    try {
        const { post_id } = req.params;
        
        const resDeletePost = await posts.destroy(
        {
            where: {post_id}
        }
    );


    //test commit 
    res.send({
        status: "success",
        message: "success delete post"
    })

    } catch (error) {
        console.log(error);
        next(error);
    }
}

router.delete("/:post_id", deletePost)

module.exports = router