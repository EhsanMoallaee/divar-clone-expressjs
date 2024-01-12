import catchAsyncErrors from '../../errorHandling/catch.asyncErrors.js';
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

	fetchAll = catchAsyncErrors(async (req, res) => {
		const parameters = await this.#ParameterService.fetchAll();
		return res.status(200).json({ parameters });
	});
}

export default new ParameterController();
