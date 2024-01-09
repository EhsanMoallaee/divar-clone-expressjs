import Joi from 'joi';

class CategoryValidator {
	constructor() {}

	addCategoryValidator = (data) => {
		const schema = Joi.object({
			title: Joi.string().required(),
			slug: Joi.string().required(),
			desc: Joi.string().required(),
			parentId: Joi.string().allow(null),
		});
		return schema.validate(data);
	};
}

export default new CategoryValidator();
