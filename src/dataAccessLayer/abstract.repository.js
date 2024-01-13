import { Types } from 'mongoose';

export default class AbstractRepository {
	#model;
	constructor(model) {
		this.#model = model;
	}

	create = async (document) => {
		const newDocument = this.#model({
			...document,
			_id: new Types.ObjectId(),
		});
		return await newDocument.save();
	};

	findOne = async (filterQuery, options = {}, populate = undefined) => {
		return await this.#model.findOne(filterQuery, options, { lean: true }).populate(populate);
	};

	findOneById = async (id, options = {}, populate = undefined) => {
		return await this.#model.findById(id, options, { lean: true }).populate(populate);
	};

	find = async (filterQuery = {}, options = {}, populate = undefined) => {
		return await this.#model.find(filterQuery, options, { lean: true }).populate(populate);
	};

	deleteOneById = async (id) => {
		return await this.#model.findByIdAndDelete(id);
	};

	aggregate = async (aggregate) => {
		return await this.#model.aggregate(aggregate);
	};
}
