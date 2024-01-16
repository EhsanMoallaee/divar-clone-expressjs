import catchAsyncErrors from '../../errorHandling/catch.asyncErrors.js';
import postService from './post.service.js';

class PostController {
	#PostService;
	constructor() {
		this.#PostService = postService;
	}

	create = catchAsyncErrors(async (req, res) => {
		const files = req.files;
		const postData = req.body;
		const result = await this.#PostService.create(postData, files);
		return res.json({ result });
	});
}

export default new PostController();
