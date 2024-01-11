import { Schema, Types, model } from 'mongoose';

const imageSchema = new Schema(
	{
		name: { type: String, required: true },
		mediaFormat: { type: String, required: true },
		size: { type: String, required: true },
		sizeType: {
			type: String,
			required: true,
			enum: ['origin', 'thumb', 'medium'],
			default: 'origin',
		},
		alternativeText: { type: String, required: true },
		url: { type: String, required: true, unique: true },
		year: { type: String, required: true },
		month: { type: String, required: true },
		advertiseId: { type: Types.ObjectId, ref: 'advertise' },
		originRefID: {
			// ref for thumb and medium size images
			type: Types.ObjectId,
			refPath: 'mediaLibrary',
		},
		originRefURL: { type: String },
	},
	{ timestamps: true }
);

const ImageModel = model('image', imageSchema);

export default ImageModel;
