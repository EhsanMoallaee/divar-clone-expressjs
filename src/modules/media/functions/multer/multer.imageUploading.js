import multer from 'multer';
import gregorianToJalali from '../date/gregorianToJalali.dateConverter.js';

const date = gregorianToJalali();
const year = date['year'];
const month = date['month'];
const imageStorage = multer.diskStorage({
	destination: function (req, file, cb) {
		const dir = process.cwd() + `/static/${year}/${month}/${file.fieldname}/`;
		return cb(null, dir);
	},
	filename: async function (req, file, cb) {
		let originalname = file.originalname.replace(/[^A-Za-z0-9.]/g, '-');
		const filename = 'img' + Date.now() + '-' + originalname;
		cb(null, filename);
	},
});

const fileFilter = (req, file, cb) => {
	// reject all files except images
	if (
		file.mimetype === 'image/jpeg' ||
		file.mimetype === 'image/jpg' ||
		file.mimetype === 'image/png' ||
		file.mimetype === 'image/gif' ||
		file.mimetype === 'image/svg'
	) {
		cb(null, true);
	} else {
		req.fileValidationError = 'WrongImageFileFormat';
		return cb(new Error(req.fileValidationError));
	}
};

export default multer({
	storage: imageStorage,
	limits: { fileSize: 1024 * 1024 * 2 },
	fileFilter: fileFilter,
});
