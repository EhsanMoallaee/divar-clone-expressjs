import Joi from 'joi';

class CategoryValidator {
	constructor() {}

	createCategoryValidator = (data) => {
		const schema = Joi.object({
			title: Joi.string().required().trim(),
			slug: Joi.string().required().trim(),
			description: Joi.string().required().trim(),
			icon: Joi.string().allow(null, ''),
			parentId: Joi.string().allow(null, ''),
		});
		return schema.validate(data);
	};
}

export default new CategoryValidator();
