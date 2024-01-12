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

	findOne = async (filterQuery, options = {}) => {
		return await this.#model.findOne(filterQuery, options, { lean: true });
	};

	findOneById = async (id, options = {}) => {
		return await this.#model.findById(id, options, { lean: true });
	};

	find = async (filterQuery = {}, options = {}, populate = undefined) => {
		return await this.#model.find(filterQuery, options, { lean: true }).populate(populate);
	};

	deleteOneById = async (id) => {
		return await this.#model.findByIdAndDelete(id);
	};
}
