import AppError from '../errorHandling/app.error.js';
import catchAsyncErrors from '../errorHandling/catch.asyncErrors.js';
import categoryService from './category.service.js';
import categoryErrorMessages from './messages/category.errorMessages.js';
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
		if (!catId)
			throw new AppError(
				categoryErrorMessages.CategoryIdRequired.message,
				categoryErrorMessages.CategoryIdRequired.statusCode
			);
		const category = await this.#CategoryService.findById(catId);
		return res.status(200).json({ category });
	});

	findBySlug = catchAsyncErrors(async (req, res) => {
		const { slug } = req.params;
		const category = await this.#CategoryService.findBySlug(slug);
		return res.status(200).json({ category });
	});

	fetchAllRootCategories = catchAsyncErrors(async (req, res) => {
		const categories = await this.#CategoryService.fetchAllRootCategories();
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
