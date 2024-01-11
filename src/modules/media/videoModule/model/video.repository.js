import AbstractRepository from '../../../../dataAccessLayer/abstract.repository.js';
import VideoModel from './video.model.js';

class VideoRepository extends AbstractRepository {
	constructor() {
		super(VideoModel);
	}
}

export default new VideoRepository();
