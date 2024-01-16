import gracefulFs from 'graceful-fs';
import gregorianToJalali from '../common/dateConverters/gregorianToJalali.dateConverter.js';

//Check media storage folder exist if doesn't so make that
export default function (type) {
	return function (req, res, next) {
		try {
			const { year, month } = gregorianToJalali();
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
