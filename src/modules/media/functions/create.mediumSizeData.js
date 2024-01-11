import gracefulFs from 'graceful-fs';

export default async function createMediumSizeData(date, mediumSizeFilename, file, imageId, imageURL) {
	const year = date['year'];
	const month = date['month'];
	const appRoot = process.cwd();
	const dir = appRoot + `/static/${year}/${month}/image/`;
	// extract size of mediumSizeFilename
	let mediumFilePath = dir + mediumSizeFilename;
	let mediumStats = await gracefulFs.statSync(mediumFilePath);
	let mediumFileSizeInBytes = mediumStats['size'];

	const mediumSizeData = {
		name: mediumSizeFilename,
		mediaFormat: file.mimetype,
		size: mediumFileSizeInBytes,
		sizeType: 'medium',
		alternativeText: mediumSizeFilename,
		url: mediumFilePath,
		year: date['year'],
		month: date['month'],
		originRefID: imageId, //id of original size
		originRefURL: imageURL, //url of original size
	};
	return mediumSizeData;
}
