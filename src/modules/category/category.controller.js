import catchAsyncErrors from '../errorHandling/catch.asyncErrors.js';
import categoryService from './category.service.js';
import categorySuccessMessages from './messages/category.successMessages.js';

class CategoryController {
	#CategoryService;
	constructor() {
		this.#CategoryService = categoryService;
	}

	create = catchAsyncErrors(async (req, res) => {
		const categoryDTO = req.body;
		const category = await this.#CategoryService.create(categoryDTO);
		return res.status(201).json(category);
	});

	findById = catchAsyncErrors(async (req, res) => {
		const { catId } = req.params;
		const category = await this.#CategoryService.findById(catId);
		return res.status(200).json({ category });
	});

	fetchAll = catchAsyncErrors(async (req, res) => {
		const categories = await this.#CategoryService.fetchAll();
		return res.status(200).json({
			categories,
		});
	});

	deleteById = catchAsyncErrors(async (req, res) => {
		const { catId } = req.params;
		await this.#CategoryService.deleteById(catId);
		return res
			.status(categorySuccessMessages.CategoryDeletedSuccessfully.statusCode)
			.json({ message: categorySuccessMessages.CategoryDeletedSuccessfully.message });
	});
}

export default new CategoryController();
