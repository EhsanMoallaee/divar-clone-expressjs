import AppError from '../../errorHandling/app.error.js';
import catchAsyncErrors from '../../errorHandling/catch.asyncErrors.js';
import profileErrorMessages from './messages/profile.errorMessages.js';
import ProfileService from './profile.service.js';

class ProfileController {
	#ProfileService;
	constructor() {
		this.#ProfileService = ProfileService;
	}

	whoami = catchAsyncErrors(async (req, res) => {
		const user = req.user;
		if (!user) {
			throw new AppError(
				profileErrorMessages.UserNotFound['message'],
				profileErrorMessages.UserNotFound['statusCode']
			);
		}
		return res.status(200).json(user);
	});

	findOneUser = catchAsyncErrors(async (req, res) => {
		const filterQuery = {};
		const queries = req.query;
		for (let key in queries) {
			if (Object.hasOwn(queries, key) && queries[key]) {
				filterQuery[key] = queries[key];
			}
		}
		if (Object.keys(filterQuery).length === 0)
			throw new AppError(
				profileErrorMessages.EmptyFilterQuery['message'],
				profileErrorMessages.EmptyFilterQuery['statusCode']
			);
		const user = await this.#ProfileService.findOneUser(filterQuery);
		return res.status(200).json(user);
	});
}

export default new ProfileController();
