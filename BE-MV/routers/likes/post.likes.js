const express = require("express");
const router = express.Router();
const { likes } = require("../../models")

const newLike = async (req, res, next) => {
    try {
        const { post_id } = req.params
        const { user_id } = req.body

        const resCreateNewLike = await likes.create({
            post_id: post_id,
            user_id: user_id
        },{
            where: {post_id}
        }
        );

        res.send({
            status: "success",
            message: "new like has been made"
        })

    } catch (error) {
        next(error) 
    }
}

router.post("/:post_id", newLike)

module.exports = router;