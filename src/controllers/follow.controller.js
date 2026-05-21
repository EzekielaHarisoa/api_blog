const pool = require("../config/db");

exports.followUser = async (req, res) => {
    try {
        const {followingId}= req.user.id;
        const {followId} = req.params;
        if (Number(followerId) === Number(followingId)) {
          return res.status(400).json({
            message: "Impossible de se follow soi-même"
          });
        }
        const result = await pool.query( `
            
            insert into followers (follower_id, following_id) values ($1, $2)
            `, [followingId, followId]);
            
    } catch (error) {
        res.status(500).json({ message: 'Error following user' });
    }
};
exports.unfollowUser = async (req, res) => {
    try {
        const {followingId}= req.user.id;
        const {followId} = req.params;

        const result = await pool.query( `
            
            delete from followers where follower_id = $1 and following_id = $2
            `, [followingId, followId]);
            
    } catch (error) {
        res.status(500).json({ message: 'Error unfollowing user' });
    }
};