const express = require('express');
const router = express.Router();
const authController = require("../controllers/auth.controller")
const authMiddleware = require("../middlewares/middleware");
const { route } = require('../../app');

router.post("/register", authController.register);
router.post("/login", authController.login);
router.get("/profile", authMiddleware, (req, res) => {
    res.status(200).json({message: "Accès au profil réussi", user: req.user});
});

module.exports = router;