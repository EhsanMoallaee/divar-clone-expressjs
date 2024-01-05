import { Types } from 'mongoose';

export default class AbstractRepository {
	constructor(model) {
		this.model = model;
	}

	create = async (document) => {
		const newDocument = this.model({
			...document,
			_id: new Types.ObjectId(),
		});
		return await newDocument.save();
	};

	findOne = async (filterQuery, options = {}) => {
		const document = await this.model.findOne(filterQuery, options, { lean: true });
		return document;
	};

	findOneById = async (id, options = {}) => {
		const document = await this.model.findById(id, options, { lean: true });
		return document;
	};

	find = async (filterQuery, options = {}) => {
		const documents = await this.model.find(filterQuery, options, { lean: true });
		return documents;
	};
}
