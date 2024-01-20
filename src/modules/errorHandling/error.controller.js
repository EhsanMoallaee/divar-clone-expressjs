import chalk from 'chalk';

const sendErrorDevelopmentMode = (err, res) => {
	let statusCode = err.statusCode || 500;

	if (err && err.message.startsWith('E11000 duplicate key')) {
		const duplicateMessage = err.message.split('{')[1].replace('}', ' ').replace('"', '').replace('"', '').trim();
		console.error(chalk.red('Duplicate :', duplicateMessage));
		err.message = `قبلا ثبت شده و نمیتواند تکراری باشد ${duplicateMessage} مقدار فیلد`;
		statusCode = 409;
	} else if (err && err.message.includes('Cast to ObjectId failed for value')) {
		err.message = 'آی دی ارسال شده صحیح نمیباشد';
		statusCode = 400;
		console.error(chalk.red('ObjectId failed :', err.message));
	} else if (err && (err.message.startsWith('invalid signature') || err.message === 'jwt malformed')) {
		err.message = 'خطای رمزنگاری توکن';
		console.error(chalk.red('Token Signature :', err.message));
		res.cookie('x-auth-token', '', {
			maxAge: 0,
			httpOnly: true,
			sameSite: 'none',
			secure: true,
		});
	} else {
		// console.error(chalk.red(err.message));
	}
	return res.status(statusCode).json({
		statusCode,
		success: false,
		message: err.message,
		stack: err.stack,
	});
};

const sendErrorProductionMode = (err, res) => {
	let statusCode = err.statusCode || 500;
	if (err.isOperational) {
		return res.status(statusCode).json({
			statusCode,
			success: false,
			message: err.message,
		});
	} else if (err.message.startsWith('E11000 duplicate key')) {
		const duplicateMessage = err.message.split('{')[1].replace('}', ' ').replace('"', '').replace('"', '').trim();
		err.message = `قبلا ثبت شده و نمیتواند تکراری باشد ${duplicateMessage} مقدار فیلد`;
		statusCode = 409;
	} else if (err && err.message.includes('Cast to ObjectId failed for value')) {
		err.message = 'مقادیر مورد نیاز به درستی ارسال نشده است';
		statusCode = 400;
	} else if (err && (err.message.startsWith('invalid signature') || err.message === 'jwt malformed')) {
		err.message =
			'مشکلی سمت سرور به وجود آمده است، لطفا لحظاتی دیگر مجددا تلاش بفرمایید ، درصورت برطرف نشدن مشکل با پشتیبانی تماس بگیرید';
		res.cookie('x-auth-token', '', {
			maxAge: 0,
			httpOnly: true,
			sameSite: 'none',
			secure: true,
		});
	} else {
		err.message =
			'مشکلی سمت سرور به وجود آمده است، لطفا لحظاتی دیگر مجددا تلاش بفرمایید ، درصورت برطرف نشدن مشکل با پشتیبانی تماس بگیرید';
	}
	return res.status(statusCode).json({
		statusCode,
		success: false,
		message: err.message,
	});
};

// eslint-disable-next-line no-unused-vars
export default (err, req, res, next) => {
	if (process.env.NODE_ENV === 'development') sendErrorDevelopmentMode(err, res);
	else sendErrorProductionMode(err, res);
};
