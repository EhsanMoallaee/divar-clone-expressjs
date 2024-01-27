import jwt from 'jsonwebtoken';

export default async function tokenVerifier(token, tokenSecretKey) {
	const verifyToken = jwt.verify(token, tokenSecretKey, function (err, decoded) {
		if (err) {
			console.log('verifyToken Error : ', err.message);
			return err.message;
		}
		return decoded;
	});
	return verifyToken;
}
