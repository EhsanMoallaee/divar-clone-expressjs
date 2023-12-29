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
		return (await newDocument.save()).toJson();
	};

	findOne = async (filterQuery) => {
		const document = await this.model.findOne(filterQuery, {}, { lean: true });
		return document;
	};

	findOneById = async (id) => {
		const document = await this.model.findById(id, {}, { lean: true });
		return document;
	};

	find = async (filterQuery) => {
		const documents = await this.model.find(filterQuery, {}, { lean: true });
		return documents;
	};
}
