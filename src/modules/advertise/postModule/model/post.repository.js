import AbstractRepository from '../../../../dataAccessLayer/abstract.repository.js';
import PostModel from './post.model.js';

class PostRepository extends AbstractRepository {
	constructor() {
		super(PostModel);
	}
}

export default new PostRepository();
