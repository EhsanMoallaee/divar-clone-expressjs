const authErrorMessages = {
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
	WrongOtpCode: {
		message: 'کد ارسال شده صحیح نمیباشد یا زمان اعتبار آن منقضی شده است',
		statusCode: 400,
	},
};

export default authErrorMessages;
