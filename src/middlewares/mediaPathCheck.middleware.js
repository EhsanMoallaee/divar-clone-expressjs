import gracefulFs from 'graceful-fs';
import gregorianToJalali from '../modules/media/functions/date/gregorianToJalali.dateConverter.js';

//Check media storage folder exist or not and make that
export default function (type) {
	return function (req, res, next) {
		try {
			const date = gregorianToJalali();
			const year = date['year'];
			const month = date['month'];
			const dir = process.cwd() + `/static/${year}/${month}/${type}`;
			if (gracefulFs.existsSync(dir)) {
				return next();
			} else {
				gracefulFs.mkdirSync(dir, { recursive: true });
				return next();
			}
		} catch (err) {
			return res.status(500).json({ message: err.message });
		}
	};
}
