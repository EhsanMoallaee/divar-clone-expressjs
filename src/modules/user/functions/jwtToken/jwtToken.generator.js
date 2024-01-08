import jwt from 'jsonwebtoken';

export default async function tokenGenerator(payload, tokenSecretKey, tokenOption) {
	const token = jwt.sign(payload, tokenSecretKey, tokenOption);
	return token;
}
