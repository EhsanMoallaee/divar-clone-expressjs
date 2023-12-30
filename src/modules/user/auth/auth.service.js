import UserRepository from '../user.repository.js';

class AuthService {
	#UserRepository;
	constructor() {
		this.#UserRepository = UserRepository;
	}

	register = async (userData) => {
		const user = await this.#UserRepository.create(userData);
		return user;
	};

	// sendOTP = async (mobile) => {};
}

export default new AuthService();
