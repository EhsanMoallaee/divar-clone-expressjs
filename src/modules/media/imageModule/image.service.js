import AppError from '../../errorHandling/app.error.js';
import imageErrorMessages from './messages/image.errorMessages.js';
import imageRepository from './model/image.repository.js';

class ImageService {
	#ImageRepository;
	constructor() {
		this.#ImageRepository = imageRepository;
	}

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
