import { Schema, Types, model } from 'mongoose';

const videoSchema = new Schema(
	{
		name: { type: String, required: true },
		mediaFormat: { type: String, required: true },
		size: { type: String, required: true },
		alternativeText: { type: String, required: true },
		url: { type: String, required: true, unique: true },
		year: { type: String, required: true },
		month: { type: String, required: true },
		advertiseId: { type: Types.ObjectId, ref: 'advertise' },
	},
	{ timestamps: true }
);

const VideoModel = model('video', videoSchema);

export default VideoModel;
