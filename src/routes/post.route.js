const express = require("express");
const router = express.Router();

const postController = require("../controllers/post.controller");
const authMiddleware = require("../middlewares/middleware");

router.post("/", authMiddleware, postController.createPost);
router.get("/", postController.getAllPosts);
router.get("/search",postController.searchPosts);
router.get("/user", postController.getAllPostByUser);
router.get("/:id", postController.getPostById);
router.put("/:id", authMiddleware, postController.editPost);
router.delete("/:id", authMiddleware, postController.deletePost);

module.exports = router;