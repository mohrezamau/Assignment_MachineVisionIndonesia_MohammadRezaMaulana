const express = require("express");
const router = express.Router();
const { likes } = require("../../models")
const { Op } = require("sequelize");
const { auth } = require("../../src/helpers/auth");

const deleteLike = async (req, res, next) => {

    try {
        const { post_id } = req.params;
        const { user_id } = req.user;
        
        const resDeleteLike = await likes.destroy(
        {
            where: {[Op.and]: {post_id, user_id}}
        }
    );

    res.send({
        status: "success",
        message: "success delete like"
    })

    } catch (error) {
        console.log(error);
        next(error);
    }
}

router.delete("/:post_id", auth, deleteLike)

module.exports = router