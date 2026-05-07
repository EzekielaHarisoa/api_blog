const pool = require("../config/db")

// creation d'un post
exports.createPost = async (req, res) => {
    try {
        const {title, content} = req.body;
        const userId = req.user.id;
        if (!title || !title.trim() || !content || !content.trim()) {
          return res.status(400).json({ message: "Titre et contenu sont obligatoires" });
       }

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
        if(post.user_id!== userId){
            return res.status(403).json({message: "Accès refusé"});
        }

        await pool.query("delete from posts where id = $1", [id]);
        res.status(200).json({message: "Post supprimé avec succès"});

    } catch (error) {
        console.error("Erreur lors de la suppression du post:", error);
        res.status(500).json({message: "Erreur du serveur"});
    }
}

// affichage de tous les posts avec pagination
exports.getAllPosts = async (req,res) => {
    try {
        let  {limit, page} = req.query;
        page = parseInt(page) || 1;
        limit = parseInt(limit) || 10;
        const offset  = (page -1) * limit;
        
        const postsResult = await pool.query("select * from posts order by created_at desc limit $1 offset $2", [limit, offset]);
        res.status(200).json({
            page, 
            limit,
            data: postsResult.rows
        });
    } catch (error) {
        console.error("Erreur lors de la récupération des posts:", error);
        res.status(500).json({message: "Erreur du serveur"});
    }
}

// affichage d'un post
exports.getPostById = async (req,res) => {
    try {
        const {id} = req.params;
        console.log("req.params =", req.params);
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

//chercher un post
exports.searchPosts = async (req,res)=>{
    try {

        let {limit, page}= req.query;
        page = parseInt(page)|| 1;
        limit = parseInt(limit) || 10;

        if(limit > 50 )limit=10;
        if(page < 1)page=1;

        const offset = (page - 1 )*limit;

        const {query} = req.query;
        if(!query || !query.trim()){
            return res.status(400).json({message: "Le paramètre de recherche est obligatoire"});
        }

        const searchResult = await pool.query("select * from posts where title ilike $1 or content ilike $2 order by created_at desc limit $3 offset $4", [`%${query}%`, `%${query}%`,limit, offset]);
        res.status(200).json({ limit, page ,data: searchResult.rows});
    } catch (error) {
        console.error("Erreur lors de la recherche des posts:", error);
        res.status(500).json({message: "Erreur du serveur"});
    }
}