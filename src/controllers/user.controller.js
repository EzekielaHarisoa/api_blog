const pool = require("../config/db");

// affichage du profile d'un user
exports.getProfile= async(req,res)=>{
    try {
        const userId = req.user.id;
        const result = await pool.query("select id , name , email, bio , avatar ,created_at from users where id = $1",[userId])
        if(result.rows.length === 0){
            return res.status(404).json({message: "Utilisateur introuvable"});
        }
        
        res.status(200).json(result.rows[0]);
    } catch (error) {
        res.status(500).json({message: "Erreur du serveur lors de la récupération du profil"});
    }
}

// modification du profile d'un user
exports.updateProfile  = async (req,res)=>{
    try {
        const userId = req.user.id;
        const {name,bio,avatar} = req.body;

        const result = await pool.query("update users set name = $1, bio = $2, avatar = $3 where id = $4 returning id, name, email , bio , avatar, created_at", [name, bio, avatar, userId]);
        if(result.rows.length === 0){
            return res.status(404).json({message: "Utilisateur introuvable"});
        }

        res.status(200).json(result.rows[0]);
    } catch (error) {
        res.status(500).json({message: "Erreur du serveur lors de la mise à jour du profil"});
    }
}

// mis a jour avatar
exports.updateUserAvatar = async (req, res) => {
  try {
    const userId = req.user.id;

    if (!req.file) {
      return res.status(400).json({ message: "Aucune image envoyée" });
    }

    const avatarUrl = `/uploads/${req.file.filename}`;

    const result = await pool.query(
      `
      UPDATE users
      SET avatar = $1
      WHERE id = $2
      RETURNING id, name, email, bio, avatar, created_at
      `,
      [avatarUrl, userId]
    );

    return res.status(200).json(result.rows[0]);

  } catch (error) {
    console.error(error);
    return res.status(500).json({
      message: "Erreur upload avatar",
      error: error.message
    });
  }
};