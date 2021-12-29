const multer = require('multer');

const MIME_TYPES = {
    'image/jpg': 'jpg',
    'image/jpeg': 'jpg',
    'image/png': 'png'
};

const storage = multer.diskStorage({
    destination: (req, file, callback) => {//indique à multer où enregistrer les fichiers
        callback(null, 'images')
    },
    filename: (req, file, callback) => {//Crée un nouveau nom à partr du nom d'origine
        let name = file.originalname.split(' ').join('_');
        const extension = MIME_TYPES[file.mimetype];
        if (/\.[a-z]{2,4}$/.test(name)) {// vérifie si une extension est déjà présente !
            name = name.replace(/\.[a-z]{2,4}$/, '');
        }
        callback(null, name + Date.now() + '.' + extension);
    }
});

module.exports = multer( { storage}).single('image');