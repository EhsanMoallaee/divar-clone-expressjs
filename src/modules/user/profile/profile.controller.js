import ProfileService from './profile.service.js';
import catchAsyncErrors from '../../errorHandling/catch.asyncErrors.js';

class ProfileController {
	#ProfileService;
	constructor() {
		this.#ProfileService = ProfileService;
	}

	findOneUser = catchAsyncErrors(async (req, res) => {
		const filterQuery = {};
		const queries = req.body;
		for (let key in queries) {
			if (Object.hasOwn(queries, key)) {
				filterQuery[key] = queries[key];
			}
		}
		const user = await this.#ProfileService.findOneUser(filterQuery);
		return res.status(200).json(user);
	});
}

export default new ProfileController();
