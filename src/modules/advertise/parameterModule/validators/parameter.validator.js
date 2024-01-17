import Joi from 'joi';
import JoiObjectId from 'joi-objectid';
const joiObjectId = JoiObjectId(Joi);

class ParameterValidator {
	constructor() {}

	createParameterValidator = (data) => {
		const schema = Joi.object({
			title: Joi.string().required().trim(),
			key: Joi.string().required().trim(),
			type: Joi.string().valid('number', 'string', 'boolean', 'array').required(),
			enum: Joi.alternatives().try(Joi.array(), Joi.string()),
			guide: Joi.string().allow(null, '').trim(),
			isRequired: Joi.boolean(),
			category: joiObjectId().required(),
		});
		return schema.validate(data);
	};

	updateParameterValidator = (data) => {
		const schema = Joi.object({
			title: Joi.string().optional().invalid('').trim(),
			key: Joi.string().optional().invalid('', null).trim(),
			type: Joi.string().optional().valid('number', 'string', 'boolean', 'array'),
			enum: Joi.alternatives().optional().try(Joi.array(), Joi.string()),
			guide: Joi.string().optional().allow(null, '').trim(),
			isRequired: Joi.boolean().optional(),
			category: joiObjectId().optional(),
		});
		return schema.validate(data);
	};
}

export default new ParameterValidator();
