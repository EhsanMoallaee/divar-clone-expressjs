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
			enum: Joi.alternatives().try(Joi.array(), Joi.string()),
			guide: Joi.string().allow(null, ''),
			isRequired: Joi.boolean(),
			category: joiObjectId().required(),
		});
		return schema.validate(data);
	};

	updateParameterValidator = (data) => {
		const schema = Joi.object({
			title: Joi.string().optional().invalid(''),
			key: Joi.string().optional().invalid('', null),
			type: Joi.string().optional().valid('number', 'string', 'boolean', 'array'),
			enum: Joi.alternatives().optional().try(Joi.array(), Joi.string()),
			guide: Joi.string().optional().allow(null, ''),
			isRequired: Joi.boolean().optional(),
			category: joiObjectId().optional(),
		});
		return schema.validate(data);
	};
}

export default new ParameterValidator();
