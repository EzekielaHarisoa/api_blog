const pool = require("../config/db")
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
//creation d'un user
exports.register =async  (req, res) => {
   try {
    const {username, email, password} = req.body;
    const userExist = await pool.query( "select * from users where email = $1", [email] );

    if(userExist.rows.length > 0){
        return res.status(400).json({message: "L'utilisateur existe déjà"});
    }

    const hashedPassword  = await bcrypt.hash(password, 10);
    await pool.query("insert into users (name, email, password) values ($1, $2, $3)", [username, email, hashedPassword]);
    res.status(201).json({message: "Utilisateur enregistré avec succès"});

   } catch (error) {
    console.error("Erreur lors de l'enregistrement de l'utilisateur:", error);
    res.status(500).json({message: "Erreur du serveur"});
   }
    
}

// connexion d'un user
exports.login = async (req, res) => {
    try {
        const {email, password} = req.body;
        const userResult = await pool.query("select * from users where email = $1", [email]);

        if(userResult.rows.length ===0 ){
            return res.status(400).json({message : "email ou mot de pass incoreact"});
        }
        // const user = userResult.rows[0];
        // if(!user){
        //     return res.status(400).json({message : "utilisater introuvable"});
        // }
        const user = userResult.rows[0];
        const isPasswordValid = await bcrypt.compare(password, user.password);
        
        if(!isPasswordValid){
            return res.status(400).json({message : "email ou mot de pass incoreact"});
        }
        const token = jwt.sign({id : user.id, email :user.email}, process.env.JWT_SECRET, {expiresIn:"1d"})
        res.status(200).json({message: "Connexion réussie", token});


    } catch (error) {
        console.error("Erreur lors de la connexion de l'utilisateur:", error);
        res.status(500).json({message: "Erreur du serveur"});
    }

}