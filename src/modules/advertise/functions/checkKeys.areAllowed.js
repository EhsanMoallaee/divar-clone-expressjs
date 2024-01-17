import AppError from '../../errorHandling/app.error.js';
import postErrorMessages from '../postModule/messages/post.errorMessages.js';

export default async function checkKeysAreAllowed(parametersInData, allowedParametersKeys) {
	const containAllowedKeys = parametersInData.every((key) => {
		return allowedParametersKeys.indexOf(key) !== -1;
	});

	if (!containAllowedKeys)
		throw new AppError(
			postErrorMessages.ParameterIsNotAllowed.message,
			postErrorMessages.ParameterIsNotAllowed.statusCode
		);
	return true;
}
