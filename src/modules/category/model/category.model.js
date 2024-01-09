import { Schema, model, Types } from 'mongoose';

const categorySchema = new Schema(
	{
		title: { type: String, required: true, unique: true },
		slug: { type: String, required: true, unique: true, index: true },
		description: { type: String, required: true },
		icon: { type: String },
		parentId: {
			type: Types.ObjectId,
			default: null,
			ref: 'category',
		},
		parentsIdArray: { type: [Types.ObjectId], default: [] },
	},
	{ versionKey: false, id: false, timestamps: true, toJSON: { virtuals: true } }
);

categorySchema.virtual('children', {
	ref: 'category',
	localField: '_id',
	foreignField: 'parentId',
});

const CategoryModel = model('category', categorySchema);

export default CategoryModel;
