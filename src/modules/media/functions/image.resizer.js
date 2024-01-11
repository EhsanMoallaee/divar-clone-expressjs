import gracefulFs from 'graceful-fs';
import sharp from 'sharp';
import gregorianToJalali from './date/gregorianToJalali.dateConverter.js';

export default async function imageResizer(imageUrl, imageName) {
	if (imageUrl) {
		const date = gregorianToJalali();
		const year = date['year'];
		const month = date['month'];
		const appRoot = process.cwd();
		const dir = appRoot + `/static/${year}/${month}/image/`;
		const thumbnailSizeFilename = 'thumb-' + imageName;
		const mediumSizeFilename = 'medium-' + imageName;
		const imgBuffer = await sharp(imageUrl).toBuffer();

		const thumbnail = await sharp(imgBuffer).resize(80, 80).toBuffer();
		const medium = await sharp(imgBuffer).resize(300, 300).toBuffer();

		gracefulFs.writeFileSync(dir + thumbnailSizeFilename, thumbnail, (err) => {
			if (err) console.log(err);
		});
		gracefulFs.writeFileSync(dir + mediumSizeFilename, medium, (err) => {
			if (err) console.log(err);
		});

		return { thumbnailSizeFilename, mediumSizeFilename };
	}
}
