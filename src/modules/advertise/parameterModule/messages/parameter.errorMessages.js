const parameterErrorMessages = {
	'"title" is required': {
		message: 'وارد کردن عنوان برای مشخصه الزامیست',
		statusCode: 400,
	},
	'"title" is not allowed to be empty': {
		message: 'مقدار عنوان برای مشخصه نمیتواند خالی باشد',
		statusCode: 400,
	},
	'"title" must be a string': {
		message: 'مقدار عنوان برای مشخصه باید از نوع رشته ای باشد',
		statusCode: 400,
	},
	'"title" contains an invalid value': {
		message: 'مقدار عنوان برای مشخصه نمیتواند رشته خالی باشد',
		statusCode: 400,
	},
	'"key" is required': {
		message: 'وارد کردن کلید برای مشخصه الزامیست',
		statusCode: 400,
	},
	'"key" is not allowed to be empty': {
		message: 'مقدار کلید برای مشخصه نمیتواند خالی باشد',
		statusCode: 400,
	},
	'"key" must be a string': {
		message: 'مقدار کلید برای مشخصه باید از نوع رشته ای باشد',
		statusCode: 400,
	},
	'"key" contains an invalid value': {
		message: 'مقدار کلید برای مشخصه نمیتواند رشته خالی باشد',
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
	'"isRequired" must be a boolean': {
		message: 'باشد و نمیتواند رشته خالی باشد true یا false مقدار فیلد الزامی بودن مشخصه فقط میتواند',
		statusCode: 400,
	},
	CategoryNotFound: {
		message: 'دسته بندی مورد نظر پیدا نشد',
		statusCode: 404,
	},
	WrongCategoryId: {
		message: 'آی دی دسته بندی ارسال شده صحیح نمیباشد',
		statusCode: 400,
	},
	CategoryHasChild: {
		message: 'برای دسته بندی ای که دارای فرزند است نمیتوان مشخصهء آگهی ایجاد کرد',
		statusCode: 400,
	},
	WrongParameterId: {
		message: 'آی دی مشخصه ارسال شده صحیح نمیباشد',
		statusCode: 400,
	},
	FieldIsNotAllowed: {
		message: 'لطفا با پشتیبانی سایت تماس بگیرید',
		statusCode: 403,
	},
	ParameterNotFound: {
		message: 'مشخصه مورد نظر پیدا نشد',
		statusCode: 404,
	},
	ParametersNotFound: {
		message: 'مشخصاتی برای دسته بندی مورد نظر پیدا نشد',
		statusCode: 404,
	},
	ParameterWithKeyAndCategoryAlreadyExist: {
		message: 'این مشخصه با این دسته بندی و کلید قبلا ایجاد شده است',
		statusCode: 409,
	},
	ExceptionError: {
		message: 'درخواست معتبر نمیباشد',
		statusCode: 400,
	},
};

export default parameterErrorMessages;
