import gracefulFs from 'graceful-fs';

export default async function createThumbnailSizeData(date, thumbnailSizeFilename, file, imageId, imageURL) {
	const year = date['year'];
	const month = date['month'];
	const appRoot = process.cwd();
	const dir = appRoot + `/static/${year}/${month}/image/`;
	// extract size of thumbnailSizeFilename
	const thumbFilePath = dir + thumbnailSizeFilename;
	const thumbStats = await gracefulFs.statSync(thumbFilePath);
	const thumbFileSizeInBytes = thumbStats['size'];

	const thumbnailSizeData = {
		name: thumbnailSizeFilename,
		mediaFormat: file.mimetype,
		size: thumbFileSizeInBytes,
		sizeType: 'thumb',
		alternativeText: thumbnailSizeFilename,
		url: thumbFilePath,
		year: date['year'],
		month: date['month'],
		originRefID: imageId, //id of original size
		originRefURL: imageURL, //url of original size
	};
	return thumbnailSizeData;
}
