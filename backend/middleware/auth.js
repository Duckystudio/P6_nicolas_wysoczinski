const jwt = require('jsonwebtoken');

module.exports = (req, res, next) => {
    try {
        const token = req.headers.authorization.split(' ')[1];//extraction du token
        const decodedToken = jwt.verify(token, 'RANDOM_TOKEN_SECRET');//Vérification de la validité du token
        const userId = decodedToken.userId;
        req.auth = { userId };
        if (req.body.userId && req.body.userId !== userId) {
            throw 'User ID non valable' ;
        } else {
            next();
        }
    } catch (error) {
        res.status(403).json({ error: error | '403:unauthorized request' })
    }
}
