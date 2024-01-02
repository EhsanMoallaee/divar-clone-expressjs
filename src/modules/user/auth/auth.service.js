import { randomInt } from 'crypto';
import AppError from '../../errorHandling/app.error.js';
import UserRepository from '../user.repository.js';
import authErrorMessages from './messages/auth.errorMessages.js';
import redisSingletonInstance from '../../redisClient/redis.client.js';
import authSuccessMessages from './messages/auth.successMessages.js';

class AuthService {
	#UserRepository;
	constructor() {
		this.#UserRepository = UserRepository;
	}

	register = async (userData) => {
		const { mobile } = userData;
		const user = await this.checkUserExist(mobile);

		if (!user) {
			const getRedisValue = await redisSingletonInstance.getData(mobile);
			console.log('getRedisValue : ', getRedisValue);
			if (getRedisValue)
				throw new AppError(authErrorMessages.SpamAttack['message'], authErrorMessages.SpamAttack['statusCode']);
			const optCode = randomInt(10000, 99999);
			await redisSingletonInstance.setData(mobile, optCode, 10);
			this.sendOTP(mobile, optCode);
			return { message: authSuccessMessages.OTPSentSuccessfully['message'], optCode };
		}

		return user;
	};

	async sendOTP(mobile, optCode) {
		console.log('sendOTP :', optCode);
		return mobile;
	}

	async checkUserExist(mobile) {
		const user = await this.#UserRepository.findOne({ mobile });
		return user;
	}
}

export default new AuthService();
