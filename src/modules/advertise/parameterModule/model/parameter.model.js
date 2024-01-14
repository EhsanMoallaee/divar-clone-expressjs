import { Schema, Types, model } from 'mongoose';

const parameterSchema = new Schema(
	{
		title: { type: String, required: true },
		key: { type: String, required: true },
		type: { type: String, enum: ['number', 'string', 'boolean', 'array'], required: true },
		enum: { type: Array, default: [] },
		guide: { type: String, required: false },
		isRequired: { type: Boolean, required: false, default: false },
		category: { type: Types.ObjectId, ref: 'category', required: true },
	},
	{ versionKey: false }
);

const ParameterModel = model('parameter', parameterSchema);

export default ParameterModel;
