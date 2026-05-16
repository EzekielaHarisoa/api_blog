const jwt  = require("jsonwebtoken");

module.exports = (req, res, next) => {
    const authHeader = req.headers.authorization;

    if (!authHeader) {
        return res.status(401).json({ message: "Token non fourni" });
    }

    const token = authHeader.split(" ")[1];

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        req.user = decoded;
        console.log("AUTH HEADER:", authHeader);
        console.log("TOKEN:", token);
        console.log("DECODED:", decoded);
        next();
    } catch (error) {
        return res.status(401).json({ message: "Token invalide" });
    }
}