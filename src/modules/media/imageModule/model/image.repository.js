import AbstractRepository from '../../../../dataAccessLayer/abstract.repository.js';
import ImageModel from './image.model.js';

class ImageRepository extends AbstractRepository {
	constructor() {
		super(ImageModel);
	}
}

export default new ImageRepository();
