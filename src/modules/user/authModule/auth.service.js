import { randomInt } from 'crypto';
import config from 'config';

import AppError from '../../errorHandling/app.error.js';
import authErrorMessages from './messages/auth.errorMessages.js';
import authSuccessMessages from './messages/auth.successMessages.js';
import kavenegarSmsSender from '../functions/kavenegarSmsSender/kavenegar.sendOtpCode.js';
import redisSingletonInstance from '../../redisClient/redis.client.js';
import tokenGenerator from '../functions/jwtToken/jwtToken.generator.js';
import UserRepository from '../model/user.repository.js';
import { Roles } from '../model/user.model.js';
import authValidator from './validators/auth.validator.js';

class AuthService {
	#UserRepository;
	constructor() {
		this.#UserRepository = UserRepository;
	}

	registerationRequest = async (userData) => {
		const { error } = authValidator.registerationRequestValidator(userData);
		if (error) {
			const errorMessage = error.message;
			if (errorMessage.endsWith('is not allowed')) {
				throw new AppError(
					authErrorMessages.FieldIsNotAllowed.message,
					authErrorMessages.FieldIsNotAllowed.statusCode
				);
			} else if (errorMessage?.startsWith('"mobile" with value')) {
				throw new AppError(
					authErrorMessages.WrongMobileFormat.message,
					authErrorMessages.WrongMobileFormat.statusCode
				);
			} else if (authErrorMessages[errorMessage]) {
				throw new AppError(authErrorMessages[errorMessage].message, authErrorMessages[errorMessage].statusCode);
			} else {
				throw new AppError(
					authErrorMessages.ExceptionError.message,
					authErrorMessages.ExceptionError.statusCode
				);
			}
		}
		const { mobile, firstname, lastname } = userData;
		const user = await this.checkUserExist(mobile);
		if (!user) {
			const getRedisValue = await redisSingletonInstance.getData(mobile);
			if (getRedisValue)
				throw new AppError(authErrorMessages.SpamAttack.message, authErrorMessages.SpamAttack.statusCode);
			const otpCode = randomInt(10000, 99999);
			const data = {
				firstname,
				lastname,
				mobile,
				otpCode,
			};
			await redisSingletonInstance.setData(mobile, data, config.get('authOTPCode.validDuration'));
			const otpSentResult = await kavenegarSmsSender(mobile, otpCode);
			if (otpSentResult != 200) {
				if (otpSentResult == 411)
					throw new AppError(
						authErrorMessages.WrongMobileNumber.message,
						authErrorMessages.WrongMobileNumber.statusCode
					);

				throw new AppError(
					authErrorMessages.OtpcodeSendingFailed.message,
					authErrorMessages.OtpcodeSendingFailed.statusCode
				);
			}
			return {
				message: authSuccessMessages.OTPSentSuccessfully.message,
				statusCode: authSuccessMessages.OTPSentSuccessfully.statusCode,
			};
		}
		throw new AppError(authErrorMessages.DuplicateMobile.message, authErrorMessages.DuplicateMobile.statusCode);
	};

	register = async (data, userAgent) => {
		const { error } = authValidator.registerValidator(data);
		if (error) {
			const errorMessage = error.message;
			if (errorMessage.endsWith('is not allowed')) {
				throw new AppError(
					authErrorMessages.FieldIsNotAllowed.message,
					authErrorMessages.FieldIsNotAllowed.statusCode
				);
			} else if (errorMessage?.startsWith('"mobile" with value')) {
				throw new AppError(
					authErrorMessages.WrongMobileFormat.message,
					authErrorMessages.WrongMobileFormat.statusCode
				);
			} else if (authErrorMessages[errorMessage]) {
				throw new AppError(authErrorMessages[errorMessage].message, authErrorMessages[errorMessage].statusCode);
			} else {
				throw new AppError(
					authErrorMessages.ExceptionError.message,
					authErrorMessages.ExceptionError.statusCode
				);
			}
		}
		const { mobile, otpCode } = data;
		const getRedisValue = JSON.parse(await redisSingletonInstance.getData(mobile));
		if (!getRedisValue)
			throw new AppError(authErrorMessages.WrongOtpCode.message, authErrorMessages.WrongOtpCode.statusCode);
		if (getRedisValue.otpCode == otpCode) {
			const userExist = await this.checkUserExist(mobile);
			if (userExist)
				throw new AppError(authErrorMessages.SpamAttack.message, authErrorMessages.SpamAttack.statusCode);

			const userData = {
				firstname: getRedisValue.firstname,
				lastname: getRedisValue.lastname,
				mobile: getRedisValue.mobile,
				verifiedMobile: true,
				role: Roles.USER,
			};
			const user = await this.#UserRepository.create(userData);

			const accessToken = await tokenGenerator(
				{ id: user._id, mobile: user.mobile },
				process.env.ACCESS_TOKEN_SECRET_KEY,
				config.get('accessTokenOptions')
			);
			const refreshToken = await tokenGenerator(
				{ id: user._id },
				process.env.REFRESH_TOKEN_SECRET_KEY,
				config.get('refreshTokenOptions')
			);

			await this.updateUserRefreshTokens(user._id, refreshToken, userAgent);

			await redisSingletonInstance.deleteData(mobile);
			return {
				message: authSuccessMessages.RegisteredSuccessfully.message,
				statusCode: authSuccessMessages.RegisteredSuccessfully.statusCode,
				accessToken,
				refreshToken,
			};
		}
		throw new AppError(authErrorMessages.WrongOtpCode.message, authErrorMessages.WrongOtpCode.statusCode);
	};

	loginRequest = async (mobile) => {
		const { error } = authValidator.loginRequestValidator({ mobile });
		if (error) {
			const errorMessage = error.message;
			if (errorMessage.endsWith('is not allowed')) {
				throw new AppError(
					authErrorMessages.FieldIsNotAllowed.message,
					authErrorMessages.FieldIsNotAllowed.statusCode
				);
			} else if (errorMessage?.startsWith('"mobile" with value')) {
				throw new AppError(
					authErrorMessages.WrongMobileFormat.message,
					authErrorMessages.WrongMobileFormat.statusCode
				);
			} else if (authErrorMessages[errorMessage]) {
				throw new AppError(authErrorMessages[errorMessage].message, authErrorMessages[errorMessage].statusCode);
			} else {
				throw new AppError(
					authErrorMessages.ExceptionError.message,
					authErrorMessages.ExceptionError.statusCode
				);
			}
		}
		const user = await this.checkUserExist(mobile);
		if (!user)
			throw new AppError(authErrorMessages.RegisterFirst.message, authErrorMessages.RegisterFirst.statusCode);
		const getRedisValue = await redisSingletonInstance.getData(mobile);
		if (getRedisValue)
			throw new AppError(authErrorMessages.SpamAttack.message, authErrorMessages.SpamAttack.statusCode);
		const otpCode = randomInt(10000, 99999);
		const data = {
			mobile,
			otpCode,
		};
		await redisSingletonInstance.setData(mobile, data, config.get('authOTPCode.validDuration'));
		const otpSentResult = await kavenegarSmsSender(mobile, otpCode);
		if (otpSentResult != 200) {
			if (otpSentResult == 411)
				throw new AppError(
					authErrorMessages.WrongMobileNumber.message,
					authErrorMessages.WrongMobileNumber.statusCode
				);

			throw new AppError(
				authErrorMessages.OtpcodeSendingFailed.message,
				authErrorMessages.OtpcodeSendingFailed.statusCode
			);
		}
		return {
			message: authSuccessMessages.OTPSentSuccessfully.message,
			statusCode: authSuccessMessages.OTPSentSuccessfully.statusCode,
		};
	};

	login = async (data, userAgent) => {
		const { error } = authValidator.loginValidator(data);
		if (error) {
			const errorMessage = error.message;
			if (errorMessage.endsWith('is not allowed')) {
				throw new AppError(
					authErrorMessages.FieldIsNotAllowed.message,
					authErrorMessages.FieldIsNotAllowed.statusCode
				);
			} else if (errorMessage?.startsWith('"mobile" with value')) {
				throw new AppError(
					authErrorMessages.WrongMobileFormat.message,
					authErrorMessages.WrongMobileFormat.statusCode
				);
			} else if (authErrorMessages[errorMessage]) {
				throw new AppError(authErrorMessages[errorMessage].message, authErrorMessages[errorMessage].statusCode);
			} else {
				throw new AppError(
					authErrorMessages.ExceptionError.message,
					authErrorMessages.ExceptionError.statusCode
				);
			}
		}
		const { mobile, otpCode } = data;
		const getRedisValue = JSON.parse(await redisSingletonInstance.getData(mobile));
		if (!getRedisValue)
			throw new AppError(authErrorMessages.WrongOtpCode.message, authErrorMessages.WrongOtpCode.statusCode);
		if (getRedisValue.otpCode == otpCode) {
			const userExist = await this.checkUserExist(mobile);
			if (!userExist)
				throw new AppError(authErrorMessages.WrongOtpCode.message, authErrorMessages.WrongOtpCode.statusCode);

			const accessToken = await tokenGenerator(
				{ id: userExist._id, mobile: userExist.mobile },
				process.env.ACCESS_TOKEN_SECRET_KEY,
				config.get('accessTokenOptions')
			);
			const refreshToken = await tokenGenerator(
				{ id: userExist._id },
				process.env.REFRESH_TOKEN_SECRET_KEY,
				config.get('refreshTokenOptions')
			);

			await this.removeUserRefreshTokenByUserAgent(userExist._id, userAgent);
			await this.updateUserRefreshTokens(userExist._id, refreshToken, userAgent);
			await redisSingletonInstance.deleteData(mobile);
			return {
				message: authSuccessMessages.LoggedInSuccessfully.message,
				statusCode: authSuccessMessages.OTPSentSuccessfully.statusCode,
				accessToken,
				refreshToken,
			};
		}
		throw new AppError(authErrorMessages.WrongOtpCode.message, authErrorMessages.WrongOtpCode.statusCode);
	};

	checkUserExist = async (mobile) => {
		const user = await this.#UserRepository.findOne({ mobile });
		return user;
	};

	removeUserRefreshTokenByUserAgent = async (userId, userAgent) => {
		const filterQuery = {
			$pull: {
				refreshTokens: { ...userAgent },
			},
		};
		await this.#UserRepository.update(userId, filterQuery);
	};

	removeUserRefreshTokenByRefreshToken = async (userId, refreshToken) => {
		const filterQuery = {
			$pull: {
				refreshTokens: { refreshToken },
			},
		};
		await this.#UserRepository.update(userId, filterQuery);
	};

	updateUserRefreshTokens = async (userId, refreshToken, userAgent) => {
		const refreshTokenData = {
			refreshToken,
			...userAgent,
		};
		const updateQuery = { $push: { refreshTokens: refreshTokenData } };
		await this.#UserRepository.update(userId, updateQuery);
	};
}

export default new AuthService();
