const multer = require('multer');
const SharpMulter = require("sharp-multer");

const storage =
    SharpMulter({
        destination: (req, file, callback) => callback(null, "images"),
        imageOptions: {
            fileFormat: "png",
            quality: 80,
            resize: { width: 500, height: 500 },
        }
    });

module.exports = multer({ storage }).single('avatar');