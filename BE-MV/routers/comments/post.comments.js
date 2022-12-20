const express = require("express");
const router = express.Router();
const { posts } = require("../../models")
const { comments } = require("../../models")

const newComment = async (req, res, next) => {
    try {
        const { post_id } = req.params
        const { phrase, user_id } = req.body

        const resCreateNewComment = await comments.create({
            phrase: phrase,
            post_id: post_id,
            user_id: user_id
        },{
            where: {post_id}
        }
        );
        
        res.send({
            status: "success",
            message: "comment made successfully"
        })

    } catch (error) {
        next(error)
    }
}

router.post("/:post_id", newComment)

module.exports = router;