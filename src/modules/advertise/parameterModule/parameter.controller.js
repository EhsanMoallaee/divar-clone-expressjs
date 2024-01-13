import catchAsyncErrors from '../../errorHandling/catch.asyncErrors.js';
import parameterSuccessMessages from './messages/parameter.successMessages.js';
import ParameterService from './parameter.service.js';

class ParameterController {
	#ParameterService;
	constructor() {
		this.#ParameterService = ParameterService;
	}

	create = catchAsyncErrors(async (req, res) => {
		const parameterDTO = req.body;
		const parameter = await this.#ParameterService.create(parameterDTO);
		return res.status(201).json({ parameter });
	});

	findById = catchAsyncErrors(async (req, res) => {
		const { parameterId } = req.params;
		const parameter = await this.#ParameterService.findById(parameterId);
		return res.status(200).json({ parameter });
	});

	findByCategoryId = catchAsyncErrors(async (req, res) => {
		const { categoryId } = req.params;
		const parameters = await this.#ParameterService.findByCategoryId(categoryId);
		return res.status(200).json({ parameters });
	});

	findByCategorySlug = catchAsyncErrors(async (req, res) => {
		const { categorySlug } = req.params;
		const parameters = await this.#ParameterService.findByCategorySlug(categorySlug);
		return res.status(200).json({ parameters });
	});

	fetchAll = catchAsyncErrors(async (req, res) => {
		const parameters = await this.#ParameterService.fetchAll();
		return res.status(200).json({ parameters });
	});

	delete = catchAsyncErrors(async (req, res) => {
		const { parameterId } = req.params;
		await this.#ParameterService.delete(parameterId);
		return res
			.status(parameterSuccessMessages.ParameterDeletedSuccessfully.statusCode)
			.json({ message: parameterSuccessMessages.ParameterDeletedSuccessfully.message });
	});
}

export default new ParameterController();
