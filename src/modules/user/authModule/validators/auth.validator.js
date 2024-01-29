import Joi from 'joi';

class AuthValidator {
	constructor() {}

	registerationRequestValidator = (data) => {
		const schema = Joi.object({
			firstname: Joi.string().min(3).max(20).required().trim(),
			lastname: Joi.string().min(3).max(20).required().trim(),
			mobile: Joi.string()
				.length(11)
				.pattern(/^[0-9]+$/)
				.required(),
		});
		return schema.validate(data);
	};

	registerValidator = (data) => {
		const schema = Joi.object({
			otpCode: Joi.number().integer().min(10000).max(99999).required(),
			mobile: Joi.string()
				.length(11)
				.pattern(/^[0-9]+$/)
				.required(),
		});
		return schema.validate(data);
	};

	loginRequestValidator = (data) => {
		const schema = Joi.object({
			mobile: Joi.string()
				.length(11)
				.pattern(/^[0-9]+$/)
				.required(),
		});
		return schema.validate(data);
	};

	loginValidator = (data) => {
		const schema = Joi.object({
			otpCode: Joi.number().integer().min(10000).max(99999).required(),
			mobile: Joi.string()
				.length(11)
				.pattern(/^[0-9]+$/)
				.required(),
		});
		return schema.validate(data);
	};
}

export default new AuthValidator();
