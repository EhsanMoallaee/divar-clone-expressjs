import AppError from '../../errorHandling/app.error.js';
import createMediumSizeData from '../functions/create.mediumSizeData.js';
import createOriginSizeData from '../functions/create.originSizeData.js';
import createThumbnailSizeData from '../functions/create.thumbnailSizeData.js';
import gregorianToJalali from '../functions/date/gregorianToJalali.dateConverter.js';
import imageErrorMessages from './messages/image.errorMessages.js';
import ImageRepository from './model/image.repository.js';
import imageResizer from '../functions/image.resizer.js';
import imageUploader from '../functions/image.uploader.js';

class ImageService {
	#ImageRepository;
	constructor() {
		this.#ImageRepository = ImageRepository;
	}

	uploadImageService = async (req, res, next) => {
		const self = this;
		imageUploader(req, res, async function (err) {
			const result = {};
			if (err) {
				if (err.message == 'Unexpected field') {
					result.error.message = imageErrorMessages.FieldIsNotAllowed.message;
					result.error.statusCode = imageErrorMessages.FieldIsNotAllowed.statusCode;
					return next(result);
				} else {
					result.error = err;
					return next(result);
				}
			} else {
				const file = req.file;
				const date = gregorianToJalali();
				const originSizeData = await createOriginSizeData(date, file);
				const image = await self.#ImageRepository.create(originSizeData);
				const { thumbnailSizeFilename, mediumSizeFilename } = await imageResizer(image.url, file.filename);
				const thumbnail = await createThumbnailSizeData(
					date,
					thumbnailSizeFilename,
					file,
					image._id,
					image.url
				);
				const mediumSize = await createMediumSizeData(date, mediumSizeFilename, file, image._id, image.url);
				await self.#ImageRepository.create(thumbnail);
				await self.#ImageRepository.create(mediumSize);
				result.image = image;
				next(result);
			}
		});
	};

	fetchAll = async () => {
		const images = await this.#ImageRepository.find(
			{ parentId: { $exists: false } },
			{ __v: 0, createdAt: 0, updatedAt: 0 }
		);
		if (!images || images.length == 0) {
			throw new AppError(imageErrorMessages.ImageNotFound.message, imageErrorMessages.ImageNotFound.statusCode);
		}
		return images;
	};
}

export default new ImageService();
