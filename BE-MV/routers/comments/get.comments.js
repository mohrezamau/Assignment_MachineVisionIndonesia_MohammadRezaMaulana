const express = require("express");
const router = express.Router();
const { comments } = require("../../models")
const { posts } = require("../../models")
const { users } = require("../../models")

const getComments = async (req, res, next) => {
    try {
        const { post_id } = req.params;
        console.log({post_id})

        const resGetComments = await comments.findAll({
            where: {post_id},
            raw: true,
            order: [["createdAt", "DESC"]]
        },);

        const mappedUser = resGetComments.map((comment)=> {
            return comment.user_id
        })

        const userFound = []

        for (const user_id of mappedUser){
            const getCommentUser = await users.findOne({where:{user_id}})
            userFound.push(getCommentUser.username)
        }

        const resCommentUser = resGetComments.map((comment, index)=>{
            comment.username=userFound[index]
            return comment;
        })

        res.send({
            status: "Success",
            message: "Success get all comments",
            data: resGetComments
        })

    } catch (error) {
        console.log(error);
        next(error)
    }
}

router.get("/:post_id", getComments)

module.exports = router;