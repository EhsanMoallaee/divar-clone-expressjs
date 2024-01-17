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
		return res.status(201).json({ result });
	});

	findByCategorySlug = catchAsyncErrors(async (req, res) => {
		const { categorySlug } = req.params;
		const posts = await this.#PostService.findByCategorySlug(categorySlug);
		return res.status(200).json({ posts });
	});
}

export default new PostController();
