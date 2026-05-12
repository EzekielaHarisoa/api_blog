const express = require('express');
const cors = require('cors');

const app = express();

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({extended: true}));

const authRoutes = require("./src/routes/auth.route");
const postRoutes = require("./src/routes/post.route");
const commentRoutes = require("./src/routes/comment.route");

app.use("/api/auth",authRoutes)
app.use("/api/posts",postRoutes);
app.use("/api/comments",commentRoutes);

module.exports = app;