import Joi from 'joi';
import JoiObjectId from 'joi-objectid';
const joiObjectId = JoiObjectId(Joi);

class ParameterValidator {
	constructor() {}

	createParameterValidator = (data) => {
		const schema = Joi.object({
			title: Joi.string().required(),
			key: Joi.string().required(),
			type: Joi.string().valid('number', 'string', 'boolean', 'array').required(),
			enum: Joi.array().allow(null, ''),
			guide: Joi.string().allow(null, ''),
			isRequired: Joi.boolean(),
			category: joiObjectId().required(),
		});
		return schema.validate(data);
	};
}

export default new ParameterValidator();
