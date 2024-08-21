const multer = require('multer');

const MIME_TYPES = {
    'image/jpg': 'jpg',
    'image/jpeg': 'jpg',
    'image/png': 'png'
};

const storage = multer.diskStorage({
    destination: (req, file, callback) => {
        /* Définition du dossier dans lequel sont stokés les fichiers */
        callback(null, 'images');
    },
    filename: (req, file, callback) => {
        /* Création du nom du fichier en remplacant les espaces par des underscores */
        const name = file.originalname.split(' ').join('_');

        /* Création de l'extension du fichier */
        const extension = MIME_TYPES[file.mimetype];

        /* Création du nom du fichier comprenant le name, un timestamp et l'extension */
        callback(null, name + Date.now() + '.' + extension);
    }
});

module.exports = multer({ storage }).single('avatar');