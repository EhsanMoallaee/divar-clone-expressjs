import { Schema, model, Types } from 'mongoose';

const categorySchema = new Schema(
	{
		title: { type: String, required: true, unique: true },
		slug: { type: String, required: true, unique: true, index: true },
		description: { type: String, required: true },
		icon: { type: String },
		parentId: {
			type: Types.ObjectId,
			default: undefined,
			ref: 'category',
		},
		parentsIdArray: { type: [Types.ObjectId], default: [] },
		hasChildren: { type: Boolean, default: false },
	},
	{ versionKey: false, id: false, timestamps: true, toJSON: { virtuals: true } }
);

categorySchema.virtual('children', {
	ref: 'category',
	localField: '_id',
	foreignField: 'parentId',
});

function autoPopulate(next) {
	this.populate([{ path: 'children' }]);
	next();
}

categorySchema.pre('find', autoPopulate).pre('findOne', autoPopulate);

const CategoryModel = model('category', categorySchema);

export default CategoryModel;
