import catchAsyncErrors from '../../errorHandling/catch.asyncErrors.js';
import imageService from './image.service.js';

class ImageController {
	#ImageService;
	constructor() {
		this.#ImageService = imageService;
	}

	// eslint-disable-next-line no-unused-vars
	uploadImage = catchAsyncErrors(async (req, res, next) => {
		this.#ImageService.uploadImageService(req, res, function (result) {
			if (result.error) {
				const statusCode = result.error.statusCode;
				const message = result.error.message;
				return res.status(statusCode).json({ message });
			} else {
				return res.status(200).json({ image: result.image });
			}
		});
	});

	fetchAll = catchAsyncErrors(async (req, res) => {
		const images = await this.#ImageService.fetchAll();
		return res.status(200).json({
			images,
		});
	});
}

export default new ImageController();
