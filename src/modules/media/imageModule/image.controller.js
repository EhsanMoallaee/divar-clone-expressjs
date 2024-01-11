import catchAsyncErrors from '../../errorHandling/catch.asyncErrors.js';
import imageService from './image.service.js';

class ImageController {
	#ImageService;
	constructor() {
		this.#ImageService = imageService;
	}

	fetchAll = catchAsyncErrors(async (req, res) => {
		const images = await this.#ImageService.fetchAll();
		return res.status(200).json({
			images,
		});
	});
}

export default new ImageController();
