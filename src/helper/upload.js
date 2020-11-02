const multer = require('multer');

const storage = multer.diskStorage({
	destination: (req, file, cb) => {
		cb(null, 'src/img');
	},
	filename: (req, file, cb) => {
		const ekstensi = file.originalname.split('.');
		cb(null, `${file.fieldname}-${Date.now()}.${ekstensi[1]}`);
	}
});

const upload = multer({
	storage,
	limits: { fileSize: 1000000 }, //1mb
	fileFilter(req, file, cb) {
		if (file.originalname.match(/\.(jpg|png)\b/)) {
			cb(null, true);
		} else {
			cb('Image must be jpg,jpeg or png', null);
		}
	}
});

module.exports = upload;
