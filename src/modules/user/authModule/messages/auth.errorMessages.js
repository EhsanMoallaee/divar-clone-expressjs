const authErrorMessages = {
	'"firstname" is required': {
		message: 'وارد کردن نام برای ثبت تام الزامیست',
		statusCode: 400,
	},
	'"firstname" is not allowed to be empty': {
		message: 'مقدار نام نمیتواند رشته خالی باشد',
		statusCode: 400,
	},
	'"firstname" length must be at least 3 characters long': {
		message: 'مقدار نام نمیتواند کمتر از سه حرف باشد',
		statusCode: 400,
	},
	'"firstname" length must be less than or equal to 20 characters long': {
		message: 'مقدار نام نمیتواند بیشتر از بیست حرف باشد',
		statusCode: 400,
	},
	'"lastname" is required': {
		message: 'وارد کردن نام خانوادگی برای ثبت تام الزامیست',
		statusCode: 400,
	},
	'"lastname" is not allowed to be empty': {
		message: 'مقدار نام خانوادگی نمیتواند رشته خالی باشد',
		statusCode: 400,
	},
	'"lastname" length must be at least 3 characters long': {
		message: 'مقدار نام خانوادگی نمیتواند کمتر از سه حرف باشد',
		statusCode: 400,
	},
	'"lastname" length must be less than or equal to 20 characters long': {
		message: 'مقدار نام خانوادگی نمیتواند بیشتر از بیست حرف باشد',
		statusCode: 400,
	},
	'"mobile" is required': {
		message: 'وارد کردن شماره تلفن همراه الزامیست',
		statusCode: 400,
	},
	'"mobile" length must be 11 characters long': {
		message: 'شماره موبایل باید شامل یازده عدد باشد',
		statusCode: 400,
	},
	'"mobile" is not allowed to be empty': {
		message: 'مقدار شماره موبایل نمیتواند رشته خالی باشد',
		statusCode: 400,
	},
	'"otpCode" is required': {
		message: 'وارد کردن کد تایید ارسال شده الزامیست',
		statusCode: 400,
	},
	'"otpCode" must be greater than or equal to 10000': {
		message: 'کد تایید نمیتواند کمتر از پنج رقم باشد',
		statusCode: 400,
	},
	'"otpCode" must be less than or equal to 99999': {
		message: 'کد تایید نمیتواند بیشتر از پنج رقم باشد',
		statusCode: 400,
	},
	'"otpCode" must be a number': {
		message: 'کد تایید فقط میتواند عدد باشد',
		statusCode: 400,
	},
	DuplicateMobile: {
		message: 'این شماره موبایل قبلا ثبت شده است',
		statusCode: 409,
	},
	ExceptionError: {
		message: 'درخواست معتبر نمیباشد',
		statusCode: 400,
	},
	OtpcodeSendingFailed: {
		message: 'در ارسال پیامک کد تایید خطایی به وجود آمد، لطفا لحظاتی دیگر مجددا اقدام بفرمایدد',
		statusCode: 500,
	},
	PreventRelogin: {
		message: '!شما اجازه دسترسی به این بخش را ندارید',
		statusCode: 403,
	},
	RegisterFirst: {
		message: 'ابتدا باید در سایت ثبت نام نمایید',
		statusCode: 400,
	},
	SpamAttack: {
		message: 'کد یکبار مصرف برای شما ارسال شده و هنوز معتبر است',
		statusCode: 400,
	},
	UnAuthenticated: {
		message: 'لطفا ابتدا وارد حساب کاربری خود شوید',
		statusCode: 401,
	},
	WrongMobileNumber: {
		message: 'شماره موبایل وارد شده نامعتبر است',
		statusCode: 400,
	},
	WrongMobileFormat: {
		message: 'شماره موبایل فقط میتواند دارای یازده عدد باشد',
		statusCode: 400,
	},
	WrongOtpCode: {
		message: 'کد ارسال شده صحیح نمیباشد یا زمان اعتبار آن منقضی شده است',
		statusCode: 400,
	},
};

export default authErrorMessages;
