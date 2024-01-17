import { Schema, Types, model } from 'mongoose';

const postSchema = new Schema(
	{
		title: { type: String, required: true },
		description: { type: String, required: true },
		directCategory: {
			category: { type: Types.ObjectId, ref: 'category', index: true },
			title: { type: String },
			slug: { type: String },
		},
		province: { type: String, required: true },
		city: { type: String, required: true },
		district: { type: String, required: true },
		coordinate: {
			type: [Number, Number],
			index: '2d',
		},
		isConfirmed: { type: Boolean, default: false },
		imagesGallery: [
			{
				url: { type: String },
				_id: false,
			},
		],
		parameters: { type: Object, default: {} },
	},
	{ versionKey: false, timestamps: true }
);

const PostModel = model('post', postSchema);

export default PostModel;
