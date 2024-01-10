import AppError from '../../errorHandling/app.error.js';
import profileErrorMessages from './messages/profile.errorMessages.js';
import UserRepository from '../model/user.repository.js';

class ProfileService {
	#UserRepository;
	constructor() {
		this.#UserRepository = UserRepository;
	}

	findOneUser = async (filterQuery) => {
		const user = await this.#UserRepository.findOne(filterQuery, { __v: 0, updatedAt: 0 });
		if (!user)
			throw new AppError(profileErrorMessages.UserNotFound.message, profileErrorMessages.UserNotFound.statusCode);
		return user;
	};
}

export default new ProfileService();
