const express = require('express');
const cors = require('cors');

const app = express();

app.use(cors());
app.use(express.json());

const authRoutes = require("./src/routes/auth.route");
const postRoutes = require("./src/routes/post.route");

app.use("/api/auth",authRoutes)
app.use("/api/posts",postRoutes);
module.exports = app;