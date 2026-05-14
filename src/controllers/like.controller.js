const pool = require("../config/db")

exports.likePost = async (req, res) => {
  try {
    const { postId } = req.params;
    const userId = req.user.id;

    // Vérifie si le post existe
    const postResult = await pool.query(
      "SELECT id FROM posts WHERE id = $1",
      [postId]
    );

    if (postResult.rows.length === 0) {
      return res.status(404).json({
        message: "Post introuvable",
      });
    }

    // Vérifie si déjà liké
    const likeResult = await pool.query(
      `SELECT EXISTS(
        SELECT 1 FROM likes
        WHERE post_id = $1 AND user_id = $2
      )`,
      [postId, userId]
    );

    const alreadyLiked = likeResult.rows[0].exists;

    if (alreadyLiked) {
      await pool.query(
        "DELETE FROM likes WHERE post_id = $1 AND user_id = $2",
        [postId, userId]
      );
    } else {
      await pool.query(
        "INSERT INTO likes (post_id, user_id) VALUES ($1, $2)",
        [postId, userId]
      );
    }

    // Nombre total de likes
    const countResult = await pool.query(
      "SELECT COUNT(*) FROM likes WHERE post_id = $1",
      [postId]
    );

    return res.status(200).json({
      message: alreadyLiked ? "Post unliked" : "Post liked",
      liked: !alreadyLiked,
      likesCount: Number(countResult.rows[0].count),
    });

  } catch (error) {
    console.error("Erreur lors du like du post:", error);

    return res.status(500).json({
      message: "Erreur interne du serveur",
    });
  }
};