const postErrorMessages = {
	'"categoryId" is required': {
		message: 'وارد کردن دسته بندی برای آگهی الزامیست',
		statusCode: 400,
	},
	'"categoryId" is not allowed to be empty': {
		message: 'مقدار دسته بندی آگهی نمیتواند رشته خالی باشد',
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
	'"coordinate" must be an array': {
		message: 'مقدار طول و عرض جغرافیایی باید بصورت آرایه ارسال شود',
		statusCode: 400,
	},
	'"coordinate[0]" must not be a sparse array item': {
		message: 'مقدار عرض جغرافیایی باید به عنوان اندیس اول آرایه ارسال شود',
		statusCode: 400,
	},
	'"coordinate" does not contain 1 required value(s)': {
		message: 'مقدار طول و عرض جغرافیایی باید بصورت آرایه شامل هر دو مقدار برای عرض و طول جغرافیایی باشد',
		statusCode: 400,
	},
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
	'"description" is required': {
		message: 'وارد کردن توضیحات برای آگهی الزامیست',
		statusCode: 400,
	},
	'"description" is not allowed to be empty': {
		message: 'مقدار توضیحات آگهی نمیتواند رشته خالی باشد',
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
	'"parameters" is required': {
		message: 'ارسال حداقل یک مشخصه برای آگهی الزامیست',
		statusCode: 400,
	},
	'"parameters" must be of type object': {
		message: 'مشخصات آگهی باید به صورت یک آبجکت ارسال شود',
		statusCode: 400,
	},
	'"parameters" must have at least 1 key': {
		message: 'مشخصات آگهی باید به صورت یک آبجکت و دارای حداقل یک عضو باشد',
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
	'"title" is required': {
		message: 'وارد کردن عنوان برای آگهی الزامیست',
		statusCode: 400,
	},
	'"title" must be a string': {
		message: 'عنوان آگهی باید از نوع رشته ای باشد',
		statusCode: 400,
	},
	'"title" is not allowed to be empty': {
		message: 'مقدار عنوان آگهی نمیتواند رشته خالی باشد',
		statusCode: 400,
	},
	AdvertisePostsNotFound: {
		message: 'آگهی ای پیدا نشد',
		statusCode: 404,
	},
	AdvertisePostNotFound: {
		message: 'آگهی مورد نظر پیدا نشد',
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
	CategorySlugIsMissing: {
		message: 'لطفا اسلاگ دسته بندی مورد نظر را ارسال بفرمایید',
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
	ParameterValueIsIncorrect: {
		message:
			'مقدار یا نوع مشخصهء ارسال شده صحیح نمیباشد،اگر لیست پیش فرض وجود دارد لطفا از آن لیست مقدار مربوطه را انتخاب نمایید',
		statusCode: 400,
	},
	ProvinceIsMissing: {
		message: 'لطفا استان مورد نظر را ارسال بفرمایید',
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
	WrongPostId: {
		message: 'آی دی آگهی ارسال شده صحیح نمیباشد',
		statusCode: 400,
	},
	YouHaveNotAnyRegisteredPost: {
		message: 'در حال حاضر آگهی ثبت‌ شده ندارید',
		statusCode: 404,
	},
};

export default postErrorMessages;
