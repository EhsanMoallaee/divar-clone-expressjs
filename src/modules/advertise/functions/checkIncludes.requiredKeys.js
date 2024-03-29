import AppError from '../../errorHandling/app.error.js';
import postErrorMessages from '../postModule/messages/post.errorMessages.js';

export default async function checkIncludesRequiredKeys(parameters, parametersInData) {
	const requiredKeys = [];
	parameters.forEach((param) => {
		if (param.isRequired) requiredKeys.push(param.key);
	});

	const containRequiredKeys = requiredKeys.every((key) => {
		return ![null, undefined, ''].includes(parametersInData[key]);
	});
	if (!containRequiredKeys)
		throw new AppError(
			postErrorMessages.RequiredParameterIsMissing.message,
			postErrorMessages.RequiredParameterIsMissing.statusCode
		);
	return true;
}
