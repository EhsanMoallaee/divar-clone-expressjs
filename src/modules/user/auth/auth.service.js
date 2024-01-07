import { randomInt } from 'crypto';
import config from 'config';

import AppError from '../../errorHandling/app.error.js';
import UserRepository from '../user.repository.js';
import authErrorMessages from './messages/auth.errorMessages.js';
import redisSingletonInstance from '../../redisClient/redis.client.js';
import authSuccessMessages from './messages/auth.successMessages.js';
import kavenegarSmsSender from '../../../common/kavenegarSmsSender/kavenegar.sendOtpCode.js';
import tokenGenerator from '../../../common/jwtToken/jwtToken.generator.js';

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
			const otpSentResult = await kavenegarSmsSender(mobile, otpCode);
			if (otpSentResult != 200) {
				if (otpSentResult == 411)
					throw new AppError(
						authErrorMessages.WrongMobileNumber['message'],
						authErrorMessages.WrongMobileNumber['statusCode']
					);

				throw new AppError(
					authErrorMessages.OtpcodeSendingFailed['message'],
					authErrorMessages.OtpcodeSendingFailed['statusCode']
				);
			}
			return { message: authSuccessMessages.OTPSentSuccessfully['message'] };
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
			throw new AppError(authErrorMessages.WrongOtpCode['message'], authErrorMessages.WrongOtpCode['statusCode']);
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
			const tokenSecretKey = process.env.TOKEN_SECRET_KEY;
			const tokenOptions = config.get('tokenOption');
			const payload = {
				mobile,
				id: user._id,
			};
			const token = await tokenGenerator(payload, tokenSecretKey, tokenOptions);
			await redisSingletonInstance.deleteData(mobile);
			return { message: authSuccessMessages.RegisteredSuccessfully['message'], token };
		}
		throw new AppError(authErrorMessages.WrongOtpCode['message'], authErrorMessages.WrongOtpCode['statusCode']);
	};

	async checkUserExist(mobile) {
		const user = await this.#UserRepository.findOne({ mobile });
		return user;
	}
}

export default new AuthService();
