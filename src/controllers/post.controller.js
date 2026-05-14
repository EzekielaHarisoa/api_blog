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
exports.getAllPosts = async (req, res) => {
  try {
    let { limit, page } = req.query;

    const userId = req.user.id; 

    page = parseInt(page) || 1;
    limit = parseInt(limit) || 10;

    const offset = (page - 1) * limit;

    const postsResult = await pool.query(
      `
      SELECT 
        posts.id,
        posts.title,
        posts.content,
        posts.created_at,
        posts.user_id,
        users.name AS author,

        -- total likes
        COUNT(distinct likes.id) AS likes_count,
        COUNT(DISTINCT comments.id) AS comments_count,

        -- si l'utilisateur a liké
        EXISTS (
          SELECT 1 FROM likes
          WHERE likes.post_id = posts.id
          AND likes.user_id = $3
        ) AS liked

      FROM posts
      JOIN users ON users.id = posts.user_id
      LEFT JOIN likes ON likes.post_id = posts.id
      LEFT JOIN comments ON comments.post_id = posts.id
      
      GROUP BY posts.id, users.name
      ORDER BY posts.created_at DESC
      LIMIT $1 OFFSET $2
      `,
      [limit, offset, userId]
    );

    res.status(200).json({
      page,
      limit,
      data: postsResult.rows,
    });

  } catch (error) {
    console.error("Erreur getAllPosts:", error);
    res.status(500).json({ message: "Erreur du serveur" });
  }
};
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

//cherher les posts d'un utilisateur
exports.getAllPostByUser = async (req, res)=>{
    try {
        let {limit,page} = req.query;
        page = parseInt(page) || 1;
        limit = parseInt(limit) || 10;

        if( page < 1 ) page = 1;
        if( limit > 50 ) limit = 50;

        const {query} = req.query;
        if(!query|| query.trim() ===""){
           return res.status(400).json({message:"Le parametre de recherche est obligatoire"})
        }

        const offset = (page - 1)*limit;
        const queryResult = await pool.query(`select posts.title, posts.content, users.name from posts
                                            join users on posts.user_id = users.id where users.name ilike $1 
                                            order by posts.created_at desc limit $2 offset $3  `, [`%${query}%` , limit, offset])
        res.status(200).json({page,limit,data:queryResult.rows})                                    
 
    } catch (error) {exercice
        console.log("erreur lors de la recherche des post par auteur"+ error)
        res.status(500).json({message:"erreur interne du serveur"})
    }
}

//tri , recherche en meme temps
exports.filtre = async (req,res)=>{
    try {
        let  {author,title,limit,page}=req.query
        page = parseInt(page) || 1;
        limit = parseInt(limit) || 10;
        let {sort} =req.query;
        sort= ( sort || "desc").toLowerCase();
        const order= sort==="ASC" ? "ASC":"DESC";
        if(!["ASC","DESC"].includes(sort)){
            return res.status(400).json({message:"Le parametre de tri doit être 'asc' ou 'desc'"})
        }
        if( page < 1 ) page = 1;
        if( limit > 50 ) limit = 50;

        if((!title|| title.trim() ==="")&&(!author || author.trim() ==="")){
           return res.status(400).json({message:"Le parametre de recherche est obligatoire"})
        }
        const offset = (page - 1)*limit;
        const trieResult = await pool.query(`select posts.title, posts.content, users.name from posts
                                            join users on posts.user_id = users.id where posts.title ilike $1 and users.name ilike $2 
                                            order by posts.created_at ${order} limit $3 offset $4 `,[`%${title || ""}%`,`%${author || ""}%`, limit,offset])

        res.status(200).json({page,limit,data:trieResult.rows});                                    

    } catch (error) {
       console.log("erreur lors de la trie et la recherhce"+ error)
       res.status(500).json({message:"erreur interne du serveur"}) 
    }
    }