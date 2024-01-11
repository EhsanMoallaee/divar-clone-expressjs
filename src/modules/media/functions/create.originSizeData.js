export default async function createOriginSizeData(date, file) {
	const originSizeData = {
		name: file.filename,
		mediaFormat: file.mimetype,
		size: file.size,
		sizeType: 'origin',
		alternativeText: file.filename,
		url: file.path,
		year: date['year'],
		month: date['month'],
	};
	return originSizeData;
}
