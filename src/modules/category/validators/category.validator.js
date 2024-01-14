import Joi from 'joi';

class CategoryValidator {
	constructor() {}

	createCategoryValidator = (data) => {
		const schema = Joi.object({
			title: Joi.string().required(),
			slug: Joi.string().required(),
			description: Joi.string().required(),
			icon: Joi.string().allow(null, ''),
			parentId: Joi.string().allow(null, ''),
		});
		return schema.validate(data);
	};
}

export default new CategoryValidator();
