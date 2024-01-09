import catchAsyncErrors from '../errorHandling/catch.asyncErrors.js';
import categoryService from './category.service.js';
import categorySuccessMessages from './messages/category.successMessages.js';

class CategoryController {
	#CategoryService;
	constructor() {
		this.#CategoryService = categoryService;
	}

	create = catchAsyncErrors(async (req, res) => {
		const data = req.body;
		const result = await this.#CategoryService.create(data);
		return res.status(201).json(result);
	});

	fetchAll = catchAsyncErrors(async (req, res) => {
		const categories = await this.#CategoryService.fetchAll();
		return res.status(categorySuccessMessages.CategoryCreatedSuccessfully['statusCode']).json({
			message: categorySuccessMessages.CategoryCreatedSuccessfully['message'],
			categories,
		});
	});
}

export default new CategoryController();
