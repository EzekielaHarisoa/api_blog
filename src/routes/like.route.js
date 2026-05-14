const express = require('express');
const router = express.Router();
const likeController = require("../controllers/like.controller");
const authMiddleware = require("../middlewares/middleware");

router.post("/posts/:postId/like", authMiddleware, likeController.likePost);

module.exports = router;