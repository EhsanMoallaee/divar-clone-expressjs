const authErrorMessages = {
	UnAuthenticated: {
		message: 'لطفا ابتدا وارد حساب کاربری خود شوید',
		statusCode: 401,
	},
	CSRFAttack: {
		message: '!شما اجازه دسترسی به این بخش را ندارید',
		statusCode: 403,
	},
	SpamAttack: {
		message: 'کد یکبار مصرف برای شما ارسال شده و هنوز معتبر است',
		statusCode: 400,
	},
	WrongOtpCode: {
		message: 'کد ارسال شده صحیح نمیباشد یا زمان اعتبار آن منقضی شده است',
		statusCode: 400,
	},
	UnAuthorized: {
		message: '!شما اجازه دسترسی به این بخش را ندارید',
		statusCode: 403,
	},
	BannedUser: {
		message: 'اکانت کاربری شما غیرفعال است، لطفا با پشتیبانی سایت تماس بگیرید',
		statusCode: 403,
	},
	DuplicateMobile: {
		message: 'این شماره موبایل قبلا ثبت شده است',
		statusCode: 409,
	},
	OtpcodeSendingFailed: {
		message: 'در ارسال پیامک کد تایید خطایی به وجود آمد، لطفا لحظاتی دیگر مجددا اقدام بفرمایدد',
		statusCode: 500,
	},
	WrongMobileNumber: {
		message: 'شماره موبایل وارد شده نامعتبر است',
		statusCode: 400,
	},
	RegisterFirst: {
		message: 'ابتدا باید در سایت ثبت نام نمایید',
		statusCode: 400,
	},
	ExceptionError: {
		message: 'درخواست معتبر نمیباشد',
		statusCode: 40,
	},
};

export default authErrorMessages;
