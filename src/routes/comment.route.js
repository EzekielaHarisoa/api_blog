const express = require("express");
const router = express.Router();
const commentController = require("../controllers/comment.controller");
const authMiddleware = require("../middlewares/middleware");

router.get("/posts/:postId/comments", commentController.getAllCommentsByPost);

router.post("/posts/:postId/comments", authMiddleware, commentController.createComment);

router.put("/:id", authMiddleware, commentController.editComment);

router.delete("/:id", authMiddleware, commentController.deleteComment);

module.exports = router;