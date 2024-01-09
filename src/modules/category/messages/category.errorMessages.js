const categoryErrorMessages = {
	'"title" is required': {
		message: 'وارد کردن عنوان برای دسته بندی الزامیست',
		statusCode: 400,
	},
	'"slug" is required': {
		message: 'وارد کردن اسلاگ برای دسته بندی الزامیست',
		statusCode: 400,
	},
	'"description" is required': {
		message: 'وارد کردن توضیحات برای دسته بندی الزامیست',
		statusCode: 400,
	},
	CategoryDidntFound: {
		message: 'دسته بندی مورد نظر پیدا نشد',
		statusCode: 404,
	},
	CategoriesDidntFound: {
		message: 'دسته بندی ای پیدا نشد',
		statusCode: 404,
	},
	CategoryIdRequired: {
		message: 'ارسال آی دی دسته بندی موردنظر الزامیست',
		statusCode: 400,
	},
	FieldIsNotAllowed: {
		message: 'لطفا با پشتیبانی سایت تماس بگیرید',
		statusCode: 403,
	},
	ParentCategoryDidntFound: {
		message: 'دسته بندی والد پیدا نشد',
		statusCode: 404,
	},
	ExceptionError: {
		message: 'درخواست معتبر نمیباشد',
		statusCode: 400,
	},
};

export default categoryErrorMessages;
