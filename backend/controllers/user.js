const User = require('../models/User');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

exports.signup = (req, res, next) => {
    User.findOne({email: req.body.email})// Vérification de la présence de l'utilisateur dans la base de donnée
        .then(user => {
            if (user) { //Inscription refusée si utilisateur déjà inscrit
                return res.status(401).json({error: "Utilisateur déjà inscrit"}) 
            } 
            bcrypt.hash(req.body.password, 10)// saltRounds par défaut = 10
                    .then(hash => {//hashage du mot de passe
                        const user = new User({// Création du nouvelle utilisateur
                            email: req.body.email,
                            password: hash
                        });
                        user.save()
                            .then(() => res.status(201).json({message: "Utilisateur créé !"}))
                            .catch(error => res.status(400).json({ error }))
                    })
        })
        .catch(error => res.status(500).json({ error }))
};

exports.login = (req, res, next) => {
    User.findOne({email: req.body.email})
        .then(user => {
            if (!user) {// Vérification de l'existence de l'utilisateur dans la base de donnée
                return res.status(401).json({error: "Utilisateur non trouvé !"});
            }
            bcrypt.compare(req.body.password, user.password)// Comparaison du mot de passe envoyé avec celui de la base de donnée pour l'utilisateur correspondant
                .then(valid => {
                    if (!valid) {// Vérification de la validité du mot de passe
                        return res.status(401).json({error: "Mot de passe incorrect !"});
                    }
                    res.status(200).json({
                        userId: user._id,
                        token: jwt.sign(//Fonction sign pour encoder un nouveau token
                            { userId: user._id },//ce token contient l'ID utilisateur en tant que payload
                            'RANDOM_TOKEN_SECRET',// chzîne secrète de développement temporaire
                            { expiresIn: '24h'}// Durée de validité du token : 24h
                        )
                    });
                })
                .catch(error => res.status(500).json({ error }));
        })
        .catch(error => res.status(500).json({ error }));
};