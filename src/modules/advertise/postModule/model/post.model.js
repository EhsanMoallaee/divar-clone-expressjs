import { number } from 'joi';
import { Schema, Types, model } from 'mongoose';

const postSchema = new Schema(
	{
		title: { type: String, required: true },
		content: { type: String, required: true },
		directCategory: {
			category: { type: Types.ObjectId, ref: 'category', index: true },
			title: { type: String },
			slug: { type: String },
		},
		categoryParents: [
			{
				categoryId: {
					type: Types.ObjectId,
					ref: 'category',
					index: true,
				},
				title: { type: String, required: true },
				slug: { type: String, required: true },
				_id: false,
			},
		],
		province: { type: String, required: true },
		city: { type: String, required: true },
		district: { type: String, required: true },
		coordinate: {
			lat: { type: number, required: true },
			long: { type: number, required: true },
		},
		image: {
			imageId: {
				type: Types.ObjectId,
				ref: 'mediaLibrary',
				index: true,
			},
			url: { type: String },
		},
		imageThumbnail: {
			imageId: {
				type: Types.ObjectId,
				ref: 'mediaLibrary',
				index: true,
			},
			url: { type: String },
		},
		imageMediumSize: {
			imageId: {
				type: Types.ObjectId,
				ref: 'mediaLibrary',
				index: true,
			},
			url: { type: String },
		},
		imagesGallery: [
			{
				imageId: {
					type: Types.ObjectId,
					ref: 'mediaLibrary',
					index: true,
				},
				url: { type: String },
				_id: false,
			},
		],
	},
	{ timestamps: true }
);

const PostModel = model('post', postSchema);

export default PostModel;
