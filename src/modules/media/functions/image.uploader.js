import imageErrorMessages from '../imageModule/messages/image.errorMessages.js';
import multerImageUploading from './multer/multer.imageUploading.js';
import UploadFieldNames from '../../../common/constants/uploadFile.enum.js';

export default async function imageUploader(req, res, next) {
	const error = {};
	const imageUpload = multerImageUploading.single(UploadFieldNames.IMAGE);
	imageUpload(req, res, async function (err) {
		if (req.fileValidationError) {
			error.message = imageErrorMessages.WrongImageFileFormat.message;
			error.statusCode = imageErrorMessages.WrongImageFileFormat.statusCode;
			return next(error);
		} else if (err) {
			if (err.code == 'LIMIT_FILE_SIZE') {
				error.message = imageErrorMessages.MaxImageFilesizeAllowedIs2mb.message;
				error.statusCode = imageErrorMessages.MaxImageFilesizeAllowedIs2mb.statusCode;
				return next(error);
			} else {
				error.message = err.message;
				error.statusCode = 500;
				return next(error);
			}
		}
		if (!req.file) {
			error.message = imageErrorMessages.AttachedFileMissing.message;
			error.statusCode = imageErrorMessages.AttachedFileMissing.statusCode;
			return next(error);
		} else {
			next();
		}
	});
}
