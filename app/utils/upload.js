const multer = require("multer");
const path = require("node:path");

const createUpload = (subDirectory) => {
	const uploadPath = path.join(
		__dirname,
		"..",
		"..",
		"public",
		"uploads",
		subDirectory,
	);

	const storage = multer.diskStorage({
		destination: (req, file, cb) => {
			cb(null, uploadPath);
		},
		filename: (req, file, cb) => {
			const timestamp = Date.now();
			const extname = path.extname(file.originalname);
			const filename = `${timestamp}-${file.fieldname}${extname}`;
			cb(null, filename);
		},
	});

	const fileFilter = (req, file, cb) => {
		const allowedTypes = ["image/jpeg", "image/png"];
		if (!allowedTypes.includes(file.mimetype)) {
			return cb(new Error("Somente imagens JPEG, PNG e GIF são permitidas."));
		}
		cb(null, true);
	};

	return multer({
		storage,
		fileFilter,
	}).single("photo");
};

module.exports = createUpload;
