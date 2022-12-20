const express = require("express");
const router = express.Router();
const {isFieldEmpties} = require("../../src/helpers");
const {auth} = require("../../src/helpers/auth");
const {uploadAvatar} = require("../../src/lib/multer");
const {users} = require("../../models");

const updateUserController = async (req, res, next) => {
    try {
      const {user_id} = req.user;
      const {bio, fullname} = req.body;
      console.log({user_id})
      console.log(req.body)

      if(bio && fullname){
        const resUpdateBioFullname = await users.update(
          {
           bio: bio,
           fullname: fullname,
            
          },
          {
            where: {user_id},
          }
        );
      } else if (bio) {
        const resUpdateBio = await users.update(
          {
           bio: bio
          },
          {
            where: {user_id},
          }
        );
      } else if (fullname) {
        const resUpdateFullname = await users.update(
          {
           fullname: fullname,
            
          },
          {
            where: {user_id},
          }
        );
      }
      
  
      // if (!resUpdateUser.affectedRows) throw {message: "Failed to update user"};
  
      res.send({
        status: "Success",
        message: "Success update user",
      });
    } catch (error) {
      next(error);
    }
  };

const updateUserAvatarController = async (req, res, next) => {
    try {
  
      const {user_id} = req.user;
      const {filename} = req.file;
      const finalFileName = `/public/userAvatar/${filename}`;
      console.log({finalFileName})
      const resUpdateAvatar = await users.update(
        {
          avatar: finalFileName,
        },
        {
          where: {
            user_id,
          },
        }
      );
  
      // if (!resUpdateAvatar.affectedRows)
      //   throw {message: "Failed to update avatar"};
  
      res.send({
        status: "Success",
        message: "Success update avatar",
      });
    } catch (error) {
      next(error);
    }
  };

  router.patch("/", auth, updateUserController);
  router.patch(
    "/avatar",
    auth,
    uploadAvatar.single("avatar"),
    updateUserAvatarController
  );
  
  module.exports = router;