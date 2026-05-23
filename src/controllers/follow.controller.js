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

// verificatiion
exports.isFollowing = async(req,res)=>{
  try {
    const followerId = req.user.id;
    const { followId } = req.params;

    const result = await pool.query(
      `SELECT * FROM followers 
       WHERE follower_id = $1 AND following_id = $2`,
      [followerId, followId]
    );
    res.status(200).json({following: result.rows.length > 0});
    
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      message: "Error checking follow status"
    });
  }
};

// ceux qui te me
exports.getFollowersCount = async (req,res)=>{
  try {
    const {userId} = req.params;
    const result = await pool.query("select count(*) as count from followers where following_id = $1",[userId]);
    return res.status(200).json({followers:Number( result.rows[0].count)});

  } catch (error) {
    console.log(error)
    return res.status(500).json({erro:"Erreur de comptage following"});
    
  }
}

//ce que j'ai suivi
exports.getFollowingCount = async (req,res)=>{
   try {
    const {userId} = req.params;
    const result = await pool.query("select count(*) as count  from followers where follower_id = $1",[userId]);
    return res.status(200).json({following :Number( result.rows[0].count)});

  } catch (error) {
    console.log(error)
    return res.status(500).json({erro:"Erreur de comptage follow"});
    
  }
} 
