import { Schema, Types, model } from 'mongoose';

const postSchema = new Schema(
	{
		user: {
			id: { type: Types.ObjectId, ref: 'user', required: true, index: true },
			mobile: { type: String, required: true },
		},
		title: { type: String, required: true },
		description: { type: String, required: true },
		directCategory: {
			id: { type: Types.ObjectId, ref: 'category', required: true, index: true },
			title: { type: String, required: true },
			slug: { type: String, required: true },
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
		parameters: [{ type: Object, default: {} }],
	},
	{ versionKey: false, timestamps: true }
);

const PostModel = model('post', postSchema);

export default PostModel;
