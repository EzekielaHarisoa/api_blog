const express = require('express');
const cors = require('cors');

const app = express();

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({extended: true}));

const authRoutes = require("./src/routes/auth.route");
const postRoutes = require("./src/routes/post.route");
const commentRoutes = require("./src/routes/comment.route");
const likeRoutes = require("./src/routes/like.route");
const userRoutes = require("./src/routes/user.route");

app.use("/api/auth",authRoutes)
app.use("/api/posts",postRoutes);
app.use("/api/comments",commentRoutes);
app.use("/api/likes",likeRoutes);
app.use("/api/users",userRoutes);
app.use("/api/uploads", express.static("uploads"));

module.exports = app;