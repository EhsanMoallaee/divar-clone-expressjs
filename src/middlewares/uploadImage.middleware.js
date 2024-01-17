import multer from 'multer';
import gracefulFs from 'graceful-fs';
import gregorianToJalali from '../common/dateConverters/gregorianToJalali.dateConverter.js';
import uploadImageErrorMessages from './messages/uploadImage.ErrorMessages.js';
import UploadFieldNames from '../common/constants/uploadFile.enum.js';

const { year, month } = gregorianToJalali();
const storage = multer.diskStorage({
	destination: async (req, file, cb) => {
		const dir = process.cwd() + `/static/${year}/${month}/${file.fieldname}/`;
		return cb(null, dir);
	},
	filename: (req, file, cb) => {
		let originalname = file.originalname.replace(/[^A-Za-z0-9.]/g, '-');
		const filename = UploadFieldNames.FILE_NAME_PREFIX + Date.now() + '-' + originalname;
		cb(null, filename);
	},
});

const upload = multer({ storage: storage });

const uploadMiddleware = (req, res, next) => {
	upload.array(UploadFieldNames.FIELD_NAME, UploadFieldNames.MAX_ALLOWED_FILES_COUNT)(req, res, (err) => {
		if (err) {
			if (err.message == 'Unexpected field') {
				return res
					.status(uploadImageErrorMessages.FieldIsNotAllowed.statusCode)
					.json({ message: uploadImageErrorMessages.FieldIsNotAllowed.message });
			}
			return res.status(400).json({ message: uploadImageErrorMessages.UnknownProblem.message });
		}

		const files = req.files;
		const errors = [];

		files.forEach((file) => {
			const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/svg'];
			const maxSize = 3 * 1024 * 1024; // 3MB

			if (!allowedTypes.includes(file.mimetype)) {
				errors.push(`${file.originalname} :${uploadImageErrorMessages.WrongImageFileFormat.message}`);
			}

			if (file.size > maxSize) {
				errors.push(`${file.originalname} :${uploadImageErrorMessages.MaxImageFileSizeError.message}`);
			}
		});

		if (errors.length > 0) {
			files.forEach((file) => {
				gracefulFs.unlinkSync(file.path);
			});

			return res.status(400).json({ errors });
		}

		req.files = files;
		next();
	});
};

export default uploadMiddleware;