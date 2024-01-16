const postErrorMessages = {
	WrongCategoryId: {
		message: 'آی دی دسته بندی ارسال شده صحیح نمیباشد',
		statusCode: 400,
	},
	CategoryNotFound: {
		message: 'دسته بندی مورد نظر پیدا نشد',
		statusCode: 404,
	},
	CategoryHasChild: {
		message: 'برای دسته بندی ای که دارای فرزند است نمیتوان مشخصهء آگهی ایجاد کرد',
		statusCode: 400,
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
};

export default postErrorMessages;
