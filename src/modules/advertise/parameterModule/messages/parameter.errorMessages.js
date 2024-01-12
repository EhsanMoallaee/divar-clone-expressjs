const parameterErrorMessages = {
	CategoryDidntFound: {
		message: 'دسته بندی مورد نظر پیدا نشد',
		statusCode: 404,
	},
	ParameterDidntFound: {
		message: 'مشخصه مورد نظر پیدا نشد',
		statusCode: 404,
	},
	ParametersDidntFound: {
		message: 'مشخصاتی برای دسته بندی مورد نظر پیدا نشد',
		statusCode: 404,
	},
	OptionWithKeyAndCategoryAlreadyExist: {
		message: 'این مشخصه با این دسته بندی و کلید قبلا ایجاد شده است',
		statusCode: 409,
	},
	ExceptionError: {
		message: 'درخواست معتبر نمیباشد',
		statusCode: 400,
	},
};

export default parameterErrorMessages;
