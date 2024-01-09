const categoryErrorMessages = {
	'"title" is required': {
		message: 'وارد کردن عنوان برای دسته بندی الزامیست',
		statusCode: 400,
	},
	'"slug" is required': {
		message: 'وارد کردن اسلاگ برای دسته بندی الزامیست',
		statusCode: 400,
	},
	'"desc" is required': {
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
	ForbiddenToMakeLoopInCategory: {
		message: 'دسته بندی والد جدید نمیتواند فرزند دسته بندی انتخاب شده باشد',
		statusCode: 403,
	},
	NewParentCategoryDidntFound: {
		message: 'دسته بندی والد جدید پیدا نشد',
		statusCode: 404,
	},
	ProductCategoryAncestorDidntFound: {
		message: 'دسته بندی والد پیدا نشد',
		statusCode: 404,
	},
	WrongParentId: {
		message: 'شناسه (آی دی) دسته بندی والد جدید اشتباه است',
		statusCode: 400,
	},
	ParentCategoryDidntFound: {
		message: 'دسته بندی والد پیدا نشد',
		statusCode: 404,
	},
};

export default categoryErrorMessages;
