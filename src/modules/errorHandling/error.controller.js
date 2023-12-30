const sendErrorDevelopmentMode = (err, res) => {
	const statusCode = err.statusCode || 500;
	return res.status(statusCode).json({
		status: 'Error',
		message: err.message,
		stack: err.stack,
	});
};

const sendErrorProductionMode = (err, res) => {
	const statusCode = err.statusCode || 500;
	return res.status(statusCode).json({
		status: 'Error',
		message: err.message,
	});
};

// eslint-disable-next-line no-unused-vars
export default (err, req, res, next) => {
	if (process.env.NODE_ENV === 'development') sendErrorDevelopmentMode(err, res);
	else sendErrorProductionMode(err, res);
};
