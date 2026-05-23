

const express = require('express');
const router = express.Router();
const followController = require("../controllers/follow.controller");
const authMiddleware = require("../middlewares/middleware");    

router.get("/isfollowing/:followId", authMiddleware, followController.isFollowing);
router.get("/followers/:userId", followController.getFollowersCount);
router.get("/following/:userId", followController.getFollowingCount);
router.post("/follow/:followId", authMiddleware, followController.followUser);
router.delete("/unfollow/:followId", authMiddleware, followController.unfollowUser);

module.exports = router;