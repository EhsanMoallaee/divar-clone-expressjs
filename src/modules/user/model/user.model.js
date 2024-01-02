import { Schema, model } from 'mongoose';

const userSchema = new Schema({
	firstname: { type: String, required: true },
	lastname: { type: String, required: true },
	mobile: { type: String, required: true, unique: true },
	verifiedMobile: { type: Boolean, default: false },
});

const UserModel = model('user', userSchema);

export default UserModel;
