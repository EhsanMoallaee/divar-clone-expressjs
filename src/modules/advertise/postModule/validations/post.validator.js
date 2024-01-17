import Joi from 'joi';
import JoiObjectId from 'joi-objectid';
const joiObjectId = JoiObjectId(Joi);

class PostValidator {
	constructor() {}

	createPostValidator = (data) => {
		const schema = Joi.object({
			title: Joi.string()
				.required()
				.pattern(/(?!^\d+$)^.+$/),
			description: Joi.string().required(),
			categoryId: joiObjectId().required(),
			province: Joi.string().required(),
			city: Joi.string().required(),
			district: Joi.string().required(),
			coordinate: Joi.array().ordered(
				Joi.number().min(-90).max(90).required(),
				Joi.number().min(-180).max(180).required()
			),
			parameters: Joi.object(),
		});
		return schema.validate(data);
	};
}

export default new PostValidator();
