const express = require("express");
const router = express.Router();
const { posts } = require("../../models")
const {uploadPosts} = require("../../src/lib/multer");
const {auth} = require("../../src/helpers/auth");

const newPost = async(req, res, next) => {
    try {
        const {filename} = req.file;
        const finalFileName = `/public/userPosts/${filename}`;
        console.log({finalFileName})
        const { caption, user_id} = req.body;
        console.log({body: req.body})
        const resCreateNewPost = await posts.create({
            caption, image: finalFileName, user_id
        })
        
        res.send({
            status: "success",
            message: "sukses bikin post",
            data: {
                result: resCreateNewPost
            },
        })


    } catch (error) {
        next(error)
    }
}

router.post("/", auth, uploadPosts.single("image"), newPost)


module.exports = router;