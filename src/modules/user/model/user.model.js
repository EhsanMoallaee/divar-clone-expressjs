import { Schema, model } from 'mongoose';

export const Roles = Object.freeze({
	SUPERADMIN: 'SUPERADMIN',
	ADMIN: 'ADMIN',
	USER: 'USER',
});

const userSchema = new Schema(
	{
		firstname: { type: String, required: true },
		lastname: { type: String, required: true },
		mobile: { type: String, required: true, unique: true },
		role: { type: String, default: Roles.USER },
	},
	{ timestamps: true }
);

const UserModel = model('user', userSchema);

export default UserModel;
