import AppError from '../../../errorHandling/app.error.js';
import authErrorMessages from '../../auth/messages/auth.errorMessages.js';
import tokenVerifier from '../jwtToken/jwtToken.verifier.js';

export default async function preventCSRFAttack(cookie) {
	const tokenSecretKey = process.env.TOKEN_SECRET_KEY;
	const decodedData = await tokenVerifier(cookie, tokenSecretKey);
	if (decodedData)
		throw new AppError(authErrorMessages.CSRFAttack['message'], authErrorMessages.CSRFAttack['statusCode']);
	return true;
}
