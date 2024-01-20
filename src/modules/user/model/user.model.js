import { Schema, model } from 'mongoose';

export const Roles = Object.freeze({
	SUPERADMIN: 'SuperAdmin',
	ADMIN: 'Admin',
	USER: 'User',
});

const userSchema = new Schema(
	{
		firstname: { type: String, required: true },
		lastname: { type: String, required: true },
		mobile: { type: String, required: true, unique: true },
		role: { type: String, enum: Roles, default: Roles.USER },
	},
	{ timestamps: true }
);

const UserModel = model('user', userSchema);

export default UserModel;
