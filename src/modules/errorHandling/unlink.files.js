import gracefulFs from 'graceful-fs';

export default async function unlinkFiles(files) {
	if (files && files.length > 0)
		for (const file of files) {
			gracefulFs.unlink(file.path, (err) => {
				if (err) {
					console.log('Unlink file error : ', err);
				}
			});
		}
}
