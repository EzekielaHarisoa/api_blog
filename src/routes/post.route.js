const express = require("express");
const router = express.Router();

const postController = require("../controllers/post.controller");
const authMiddleware = require("../middlewares/middleware");
const uploadMiddleware = require("../middlewares/uploadMiddleware")

router.post("/", authMiddleware,uploadMiddleware.single("image"), postController.createPost);
router.get("/",authMiddleware, postController.getAllPosts);
router.get("/search",authMiddleware,postController.searchPosts);
router.get("/user",authMiddleware, postController.getAllPostByUser);
router.get("/userPost/:userId",authMiddleware,postController.getPostsByUser)
router.get("/:id", postController.getPostById);
router.put("/:id", authMiddleware, postController.editPost);
router.delete("/:id", authMiddleware, postController.deletePost);
    
module.exports = router;