import catchAsyncErrors from '../../errorHandling/catch.asyncErrors.js';
import postSuccessMessages from './messages/post.successMessages.js';
import postService from './post.service.js';

class PostController {
	#PostService;
	constructor() {
		this.#PostService = postService;
	}

	create = catchAsyncErrors(async (req, res) => {
		const files = req.files;
		const postData = req.body;
		const user = req.user;
		const advertisePost = await this.#PostService.create(postData, files, user);
		return res.status(201).json({ advertisePost });
	});

	findByPostId = catchAsyncErrors(async (req, res) => {
		const { postId } = req.params;
		const advertisePost = await this.#PostService.findByPostId(postId);
		return res.status(200).json({ advertisePost });
	});

	findByCategorySlug = catchAsyncErrors(async (req, res) => {
		const { categorySlug } = req.params;
		const advertisePosts = await this.#PostService.findByCategorySlug(categorySlug);
		return res.status(200).json({ advertisePosts });
	});

	findByAddress = catchAsyncErrors(async (req, res) => {
		const { province, city, district } = req.query;
		const advertisePosts = await this.#PostService.findByAddress(province, city, district);
		return res.status(200).json({ advertisePosts });
	});

	findByCategorySlugAndAddress = catchAsyncErrors(async (req, res) => {
		const { categorySlug, province, city, district } = req.query;
		const advertisePosts = await this.#PostService.findByCategorySlugAndAddress(
			categorySlug,
			province,
			city,
			district
		);
		return res.status(200).json({ advertisePosts });
	});

	myPosts = catchAsyncErrors(async (req, res) => {
		const user = req.user;
		const posts = await this.#PostService.myPosts(user);
		return res.status(200).json({ posts });
	});

	delete = catchAsyncErrors(async (req, res) => {
		const { postId } = req.params;
		await this.#PostService.delete(postId);
		return res
			.status(postSuccessMessages.PostDeletedSuccessfully.statusCode)
			.json({ message: postSuccessMessages.PostDeletedSuccessfully.message });
	});
}

export default new PostController();
