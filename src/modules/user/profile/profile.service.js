import userRepository from '../user.repository.js';
import AppError from '../../errorHandling/app.error.js';
import profileErrorMessages from './errorMessages/profile.errorMessages.js';

class ProfileService {
	#UserRepository;
	constructor() {
		this.#UserRepository = userRepository;
	}

	findOneUser = async (filterQuery) => {
		const user = await this.#UserRepository.findOne(filterQuery);
		if (!user)
			throw new AppError(profileErrorMessages.NotFound['message'], profileErrorMessages.NotFound['statusCode']);
		return user;
	};
}

export default new ProfileService();
