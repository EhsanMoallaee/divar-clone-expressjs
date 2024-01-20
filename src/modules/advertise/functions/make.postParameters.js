import AppError from '../../errorHandling/app.error.js';
import postErrorMessages from '../postModule/messages/post.errorMessages.js';

export default async function makePostParameters(parameters, parametersInData) {
	const postParameters = [];
	parameters.map((param) => {
		if (parametersInData[param.key]) {
			postParameters.push({
				key: param.key,
				title: param.title,
				value: parametersInData[param.key],
			});
		}
	});

	console.log('🚀 ~ makePostParameters ~ postParameters:', postParameters);

	if (postParameters.length == 0)
		throw new AppError(
			postErrorMessages.ParameterIsNotAllowed.message,
			postErrorMessages.ParameterIsNotAllowed.statusCode
		);
	return postParameters;
}
