import { randomInt } from 'crypto';
import config from 'config';
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

	registerationRequest = async (userData) => {
		const { mobile, firstname, lastname } = userData;
		const user = await this.checkUserExist(mobile);

		if (!user) {
			const getRedisValue = await redisSingletonInstance.getData(mobile);
			if (getRedisValue)
				throw new AppError(authErrorMessages.SpamAttack['message'], authErrorMessages.SpamAttack['statusCode']);
			const otpCode = randomInt(10000, 99999);
			const data = {
				firstname,
				lastname,
				mobile,
				otpCode,
			};
			await redisSingletonInstance.setData(mobile, data, config.get('registrationOTPCode.validDuration'));
			this.sendOTP(mobile, otpCode);
			return { message: authSuccessMessages.OTPSentSuccessfully['message'], otpCode };
		}
		throw new AppError(
			authErrorMessages.DuplicateMobile['message'],
			authErrorMessages.DuplicateMobile['statusCode']
		);
	};

	register = async (data) => {
		const { mobile, otpCode } = data;
		const getRedisValue = JSON.parse(await redisSingletonInstance.getData(mobile));
		if (!getRedisValue)
			throw new AppError(authErrorMessages.wrongOtpCode['message'], authErrorMessages.wrongOtpCode['statusCode']);
		if (getRedisValue.otpCode == otpCode) {
			const userExist = await this.checkUserExist(mobile);
			if (userExist)
				throw new AppError(authErrorMessages.SpamAttack['message'], authErrorMessages.SpamAttack['statusCode']);
			const userData = {
				firstname: getRedisValue.firstname,
				lastname: getRedisValue.lastname,
				mobile: getRedisValue.mobile,
				verifiedMobile: true,
			};
			const user = await this.#UserRepository.create(userData);
			return user;
		}
		throw new AppError(authErrorMessages.wrongOtpCode['message'], authErrorMessages.wrongOtpCode['statusCode']);
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
