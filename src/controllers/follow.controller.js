const pool = require("../config/db");

exports.followUser = async (req, res) => {
  try {
    const followingId = req.user.id;
    const { followId } = req.params;
    console.log("followingId =", followingId, "followId =", followId);

    if (Number(followingId) === Number(followId)) {
      return res.status(400).json({
        message: "Impossible de se follow soi-même"
      });
    }

    await pool.query(
      `INSERT INTO followers (follower_id, following_id)
       VALUES ($1, $2)`,
      [followingId, followId]
    );

    return res.status(200).json({
      message: "User followed successfully"
    });

  } catch (error) {
    console.error(error);
    return res.status(500).json({
      message: "Error following user"
    });
  }
};
// unfollow a user
exports.unfollowUser = async (req, res) => {
  try {
    const followerId = req.user.id;
    const { followId } = req.params;

    await pool.query(
      `DELETE FROM followers 
       WHERE follower_id = $1 AND following_id = $2`,
      [followerId, followId]
    );

    return res.status(200).json({
      message: "User unfollowed successfully"
    });

  } catch (error) {
    console.error(error);
    return res.status(500).json({
      message: "Error unfollowing user"
    });
  }
};