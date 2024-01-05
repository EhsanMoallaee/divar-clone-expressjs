import jwt from 'jsonwebtoken';

export default async function tokenVerifier(token, tokenSecret) {
	const verifyToken = jwt.verify(token, tokenSecret, function (err, decoded) {
		if (err) {
			console.log('verifyToken Error : ', err.message);
		}
		return decoded;
	});
	return verifyToken;
}
