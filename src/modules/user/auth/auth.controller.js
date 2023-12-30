import AuthService from './auth.service.js';

class AuthController {
	#AuthService;
	constructor() {
		this.#AuthService = AuthService;
	}

	register = async (req, res) => {
		const userData = req.body;
		const user = await this.#AuthService.register(userData);
		return res.json(user);
	};
}

export default new AuthController();
