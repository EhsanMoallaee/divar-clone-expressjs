import AppError from '../../errorHandling/app.error.js';
import postErrorMessages from '../postModule/messages/post.errorMessages.js';

export default async function checkKeysAreAllowed(parametersInData, allowedKeys) {
	const containAllowedKeys = parametersInData.every((key) => {
		return allowedKeys.indexOf(key) !== -1;
	});

	if (!containAllowedKeys)
		throw new AppError(
			postErrorMessages.ParameterIsNotAllowed.message,
			postErrorMessages.ParameterIsNotAllowed.statusCode
		);
	return true;
}
