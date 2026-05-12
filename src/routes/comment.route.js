const express = require("express");
const router = express.Router();
const commentController = require("../controllers/comment.controller");
const authMiddleware = require("../middlewares/middleware");

router.get("/posts/:postId/comments",authMiddleware, commentController.getAllCommentsByPost);

router.post("/posts/:postId/comments", authMiddleware, commentController.createComment);

router.put("/comments/:id", authMiddleware, commentController.editComment);

router.delete("/comments/:id", authMiddleware, commentController.deleteComment);

module.exports = router;