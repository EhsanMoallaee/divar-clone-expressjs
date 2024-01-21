import Joi from 'joi';
import JoiObjectId from 'joi-objectid';
const joiObjectId = JoiObjectId(Joi);

class PostValidator {
	constructor() {}

	createPostValidator = (data) => {
		const schema = Joi.object({
			title: Joi.string()
				.required()
				.pattern(/(?!^\d+$)^.+$/)
				.trim(),
			description: Joi.string().required().trim(),
			categoryId: joiObjectId().required(),
			province: Joi.string().required().trim(),
			city: Joi.string().required().trim(),
			district: Joi.string().required().trim(),
			coordinate: Joi.array().ordered(
				Joi.number().min(-90).max(90).required(),
				Joi.number().min(-180).max(180).required()
			),
			parameters: Joi.object().min(1).required(),
		});
		return schema.validate(data);
	};

	confirmPostValidator = (data) => {
		const schema = Joi.object({
			postId: joiObjectId().required(),
			isConfirmed: Joi.boolean().required(),
		});
		return schema.validate(data);
	};
}

export default new PostValidator();
