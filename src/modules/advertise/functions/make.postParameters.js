import AppError from '../../errorHandling/app.error.js';
import postErrorMessages from '../postModule/messages/post.errorMessages.js';

export default async function makePostParameters(parameters, parametersInData) {
	const postParameters = [];
	let enumErrorFlag = false;
	for (const param of parameters) {
		if (parametersInData[param.key]) {
			if (param.enum && param.enum.length > 0) {
				let parameterValue =
					param.type == 'number' ? Number(parametersInData[param.key]) : parametersInData[param.key];
				if (!param.enum.includes(parameterValue)) {
					enumErrorFlag = true;
					break;
				}
			}
			postParameters.push({
				key: param.key,
				title: param.title,
				value: parametersInData[param.key],
			});
		}
	}
	if (enumErrorFlag)
		throw new AppError(
			postErrorMessages.ParameterValueIsIncorrect.message,
			postErrorMessages.ParameterValueIsIncorrect.statusCode
		);
	if (postParameters.length == 0)
		throw new AppError(
			postErrorMessages.ParameterIsNotAllowed.message,
			postErrorMessages.ParameterIsNotAllowed.statusCode
		);
	return postParameters;
}
