const postErrorMessages = {
	'"coordinate[0]" must be a number': {
		message: 'مقدار عرض جغرافیایی باید بصورت عددی ارسال شود',
		statusCode: 400,
	},
	'"coordinate[0]" must be less than or equal to 90': {
		message: 'مقدار عرض جغرافیایی نمیتواند بیشتر از 90 باشد',
		statusCode: 400,
	},
	'"coordinate[0]" must be greater than or equal to -90': {
		message: 'مقدار عرض جغرافیایی نمیتواند کمتر از 90- باشد',
		statusCode: 400,
	},
	'"coordinate[1]" must be a number': {
		message: 'مقدار طول جغرافیایی باید بصورت عددی ارسال شود',
		statusCode: 400,
	},
	'"coordinate[1]" must be less than or equal to 180': {
		message: 'مقدار طول جغرافیایی نمیتواند بیشتر از 180 باشد',
		statusCode: 400,
	},
	'"coordinate[1]" must be greater than or equal to -180': {
		message: 'مقدار طول جغرافیایی نمیتواند کمتر از 180- باشد',
		statusCode: 400,
	},
	'"title" is required': {
		message: 'وارد کردن عنوان برای آگهی الزامیست',
		statusCode: 400,
	},
	'"title" is not allowed to be empty': {
		message: 'مقدار عنوان آگهی نمیتواند رشته خالی باشد',
		statusCode: 400,
	},
	'"description" is required': {
		message: 'وارد کردن توضیحات برای آگهی الزامیست',
		statusCode: 400,
	},
	'"description" is not allowed to be empty': {
		message: 'مقدار توضیحات آگهی نمیتواند رشته خالی باشد',
		statusCode: 400,
	},
	'"categoryId" is required': {
		message: 'وارد کردن دسته بندی برای آگهی الزامیست',
		statusCode: 400,
	},
	'"categoryId" is not allowed to be empty': {
		message: 'مقدار دسته بندی آگهی نمیتواند رشته خالی باشد',
		statusCode: 400,
	},
	'"province" is required': {
		message: 'وارد کردن استان برای آگهی الزامیست',
		statusCode: 400,
	},
	'"province" is not allowed to be empty': {
		message: 'مقدار استان آگهی نمیتواند رشته خالی باشد',
		statusCode: 400,
	},
	'"city" is required': {
		message: 'وارد کردن شهر محل آگهی الزامیست',
		statusCode: 400,
	},
	'"city" is not allowed to be empty': {
		message: 'مقدار شهر محل آگهی نمیتواند رشته خالی باشد',
		statusCode: 400,
	},
	'"district" is required': {
		message: 'وارد کردن نام منطقه یا خیابان محل آگهی الزامیست',
		statusCode: 400,
	},
	'"district" is not allowed to be empty': {
		message: 'مقدار نام منطقه یا خیابان محل آگهی نمیتواند رشته خالی باشد',
		statusCode: 400,
	},
	AdvertisePostsNotFound: {
		message: 'آگهی ای پیدا نشد',
		statusCode: 404,
	},
	CategoryNotFound: {
		message: 'دسته بندی مورد نظر پیدا نشد',
		statusCode: 404,
	},
	CategoryHasChild: {
		message: 'برای دسته بندی ای که دارای فرزند است نمیتوان مشخصهء آگهی ایجاد کرد',
		statusCode: 400,
	},
	ExceptionError: {
		message: 'درخواست معتبر نمیباشد',
		statusCode: 400,
	},
	FieldIsNotAllowed: {
		message: 'لطفا با پشتیبانی سایت تماس بگیرید',
		statusCode: 403,
	},
	ParametersNotFound: {
		message: 'مشخصاتی برای دسته بندی مورد نظر پیدا نشد',
		statusCode: 404,
	},
	ParameterIsNotAllowed: {
		message: 'مشخصهء ارسال شده برای این آگهی مجاز نمیباشد',
		statusCode: 400,
	},
	RequiredParameterIsMissing: {
		message: 'تمامی مشخصات الزامی باید ارسال شده و دارای مقدار باشند',
		statusCode: 400,
	},
	TitleCouldNotBeJustNumbers: {
		message: 'عنوان آگهی نمیتواند فقط عدد باشد',
		statusCode: 400,
	},
	WrongCategoryId: {
		message: 'آی دی دسته بندی ارسال شده صحیح نمیباشد',
		statusCode: 400,
	},
};

export default postErrorMessages;
