export default async function makeImagesUrlArray(files) {
	let imagesUrls = [];
	if (files && files.length > 0) {
		imagesUrls = files.map((file) => {
			return { url: file.path };
		});
	}
	return imagesUrls;
}
