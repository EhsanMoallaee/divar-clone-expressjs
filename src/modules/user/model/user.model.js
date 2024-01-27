import { Schema, model } from 'mongoose';

export const Roles = Object.freeze({
	SUPERADMIN: 'SuperAdmin',
	ADMIN: 'Admin',
	USER: 'User',
});

const refreshTokenSchema = new Schema(
	{
		refreshToken: { type: String, required: true },
		ip: { type: String, required: true },
		browser: { type: String, required: true },
		os: { type: String, required: true },
		platform: { type: String, required: true },
		source: { type: String, required: true },
		_id: false,
	},
	{ timestamps: true }
);

const userSchema = new Schema(
	{
		firstname: { type: String, required: true },
		lastname: { type: String, required: true },
		mobile: { type: String, required: true, unique: true },
		role: { type: String, enum: Roles, default: Roles.USER },
		refreshTokens: [refreshTokenSchema],
	},
	{ timestamps: true }
);

const UserModel = model('user', userSchema);

export default UserModel;
