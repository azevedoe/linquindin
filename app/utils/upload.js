const multer = require("multer");
const path = require("node:path");

const createUpload = () => {
    const storage = multer.memoryStorage();

    const fileFilter = (req, file, cb) => {
        const allowedTypes = ["image/jpeg", "image/png"];
        if (!allowedTypes.includes(file.mimetype)) {
            return cb(new Error("Somente imagens JPEG e PNG são permitidas."));
        }
        cb(null, true);
    };

    return multer({
        storage,
        fileFilter,
        limits: {
            fileSize: 20 * 1024 * 1024, 
        }
    }).single("photo");
};

module.exports = createUpload;