const pool = require("../config/db")

// creation d'un post
exports.createPost = async (req, res) => {
    try {
        const {title, content} = req.body;
        const userId = req.user.id;

        await pool.query("insert into posts (title, content, user_id) values ($1, $2, $3)", [title, content, userId]);
        res.status(201).json({message: "Post créé avec succès"});

    } catch (error) {
        console.error("Erreur lors de la création du post:", error);
        res.status(500).json({message: "Erreur du serveur"});
    }
}   
// modification d'un post
exports.editPost = async(req,res)=>{
    try {
        const {id}= req.params;
        const  {title,content}= req.body;
        const userId= req.user.id;

        const postResult = await pool.query("select * from posts where id = $1", [id]);
        if(postResult.rows.length === 0){
            return res.status(404).json({message: "Post introuvable"});
        }

        const post = postResult.rows[0];
        if(post.user_id !== userId){
            return res.status(403).json({message: "Accès refusé"});
        }

        await pool.query("update posts set title = $1, content = $2 where id = $3", [title, content, id]);
        res.status(200).json({message: "Post modifié avec succès"});
    } catch (error1) {
        console.error("Erreur lors de la modification du post:", error1);
        res.status(500).json({message: "Erreur du serveur"});
    }
}

// suppression d'un post
exports.deletePost = async (req,res)=>{
    try {
        const {id} =req.params;
        const userId = req.user.id;

        const postResult = await pool.query("select * from posts where id = $1 ", [id]);
        if(postResult.rows.length === 0 ){
            return res.status(404).json({message: "Post introuvable"});
        }

        const post = postResult.rows[0];
        if(post.userId !== userId){
            return res.status(403).json({message: "Accès refusé"});
        }
        await pool.query("delete from posts where id = $1", [id]);
        res.status(200).json({message: "Post supprimé avec succès"});
    } catch (error) {
        console.error("Erreur lors de la suppression du post:", error);
        res.status(500).json({message: "Erreur du serveur"});
    }
}

// affichage de tous les posts
exports.getAllPosts = async (req,res) => {
    try {
        const postsResult = await pool.query("select * from posts");
        res.status(200).json({posts: postsResult.rows});
    } catch (error) {
        console.error("Erreur lors de la récupération des posts:", error);
        res.status(500).json({message: "Erreur du serveur"});
    }
}

// affichage d'un post
exports.getPostById = async (req,res) => {
    try {
        const {id} = req.params;
        const postResult = await pool.query("select * from posts where id = $1", [id]);

        if(postResult.rows.length === 0){
            return res.status(404).json({message: "Post introuvable"});
        }
        res.status(200).json({post: postResult.rows[0]});
    } catch (error) {
        console.error("Erreur lors de la récupération du post:", error);
        res.status(500).json({message: "Erreur du serveur"});
    }
}