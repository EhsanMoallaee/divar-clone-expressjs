import catchAsyncErrors from '../errorHandling/catch.asyncErrors.js';
import categoryService from './category.service.js';

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
		return res.status(200).json({ categories });
	});
}

export default new CategoryController();
