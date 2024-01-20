export default async function makeImagesUrlArray(files) {
	let imagesUrls = [];
	if (files && files.length > 0) {
		imagesUrls = files.map((file) => {
			return { url: file.path };
		});
	}

	console.log('🚀 ~ makeImageUrlsArray ~ imagesUrl:', imagesUrls);
	// if (postParameters.length == 0)
	// 	throw new AppError(
	// 		postErrorMessages.ParameterIsNotAllowed.message,
	// 		postErrorMessages.ParameterIsNotAllowed.statusCode
	// 	);
	return imagesUrls;
}
