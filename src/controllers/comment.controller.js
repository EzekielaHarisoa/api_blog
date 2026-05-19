const pool = require("../config/db");
//creation d'un commentaire
exports.createComment = async (req, res) => {
  try {
    const { content } = req.body;
    const user_id = req.user.id;
    const postId = req.params.postId;

    if (!content || content.trim() === "") {
      return res.status(400).json({
        message: "Le contenu du commentaire ne peut pas être vide",
      });
    }

    // insertion de commentaire
    const insertedComment = await pool.query(
      `
      INSERT INTO comments (content, user_id, post_id)
      VALUES ($1, $2, $3)
      RETURNING *
      `,
      [content, user_id, postId]
    );

    const comment = insertedComment.rows[0];

    // get tout les info coms et utilisateurs
    const fullComment = await pool.query(
      `
      SELECT
        comments.*,
        users.name,
        users.avatar
      FROM comments
      JOIN users
      ON users.id = comments.user_id
      WHERE comments.id = $1
      `,
      [comment.id]
    );

    return res.status(201).json(fullComment.rows[0]);

  } catch (error) {
    console.error("Erreur lors de la création du commentaire:", error);

    return res.status(500).json({
      message: "Erreur du serveur",
    });
  }
};

// modification d'un commentaire
exports.editComment = async (req,res)=>{
    try {
        const {id} = req.params;
        const {content} = req.body;
        const userId = req.user.id;
        if (!content || !content.trim()) {
           return res.status(400).json({message: "Contenu obligatoire" }); 
        }
        const userResult = await pool.query("select * from comments where id = $1", [id]);
        if(userResult.rows.length === 0){
            return res.status(404).json({message: "Commentaire introuvable"});
        }

        const comment = userResult.rows[0];
        if(comment.user_id !==userId){
            return res.status(403).json({message: "Accès refusé"});
        }

        await pool.query("update comments set content = $1 where id = $2", [content, id]);
        res.status(200).json({message: "Commentaire mis à jour avec succès"});

    } catch (error) {
        console.error("Erreur lors de la modification du commentaire:", error);
        res.status(500).json({message: "Erreur du serveur"});
    }
}
// suppression d'un commentaire
exports.deleteComment = async (req,res)=>{
    try {
        const {id} = req.params;
        const userId = req.user.id;

        const commentResult = await pool.query("select * from comments where id = $1", [id]);
        if(commentResult.rows.length === 0){
            return res.status(404).json({message: "Commentaire introuvable"});
         }

         const comment = commentResult.rows[0];
         if(comment.user_id !== userId){
             return res.status(403).json({message: "Accès refusé"});
         }

         await pool.query("delete from comments where id = $1", [id]);
         res.status(200).json({message: "Commentaire supprimé avec succès"});

    } catch (error) {
        console.error("Erreur lors de la suppression du commentaire:", error);
        res.status(500).json({message: "Erreur du serveur"});
    }
}

// voir tout les comments d'un post
exports.getAllCommentsByPost = async(req,res)=>{
    try {
        const {postId} = req.params;

const commentResult = await pool.query(
  `
  SELECT 
    comments.id,
    comments.content,
    comments.created_at,
    comments.user_id,
    users.name,
    users.avatar
  FROM comments
  JOIN users ON comments.user_id = users.id
  WHERE comments.post_id = $1
  ORDER BY comments.created_at DESC
  `,
  [postId]
);
        res.status(200).json(commentResult.rows);

    } catch (error) {
        console.error("Erreur lors de la récupération des commentaires:", error);
        res.status(500).json({message: "Erreur du serveur"});
    }
}

