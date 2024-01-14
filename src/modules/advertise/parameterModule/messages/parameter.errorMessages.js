const parameterErrorMessages = {
	'"title" is required': {
		message: 'وارد کردن عنوان برای مشخصه الزامیست',
		statusCode: 400,
	},
	'"title" is not allowed to be empty': {
		message: 'مقدار عنوان مشخصه نمیتواند خالی باشد',
		statusCode: 400,
	},
	'"key" is required': {
		message: 'وارد کردن کلید برای مشخصه الزامیست',
		statusCode: 400,
	},
	'"key" is not allowed to be empty': {
		message: 'مقدار کلید مشخصه نمیتواند خالی باشد',
		statusCode: 400,
	},
	'"type" is required': {
		message: 'وارد کردن نوع برای مشخصه الزامیست',
		statusCode: 400,
	},
	'"type" must be one of [number, string, boolean, array]': {
		message: 'باشد [number, string, boolean, array] مقدار نوع فقط میتواند یکی از مقادیر ',
		statusCode: 400,
	},
	'"category" is required': {
		message: 'وارد کردن دسته بندی برای مشخصه الزامیست',
		statusCode: 400,
	},
	CategoryDidntFound: {
		message: 'دسته بندی مورد نظر پیدا نشد',
		statusCode: 404,
	},
	FieldIsNotAllowed: {
		message: 'لطفا با پشتیبانی سایت تماس بگیرید',
		statusCode: 403,
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
