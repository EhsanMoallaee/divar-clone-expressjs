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
	wrongOtpCode: {
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
		message: 'در ارسال پیامک کد تایید خطایی به وجود آمو، لطفا لحظاتی دیگر مجددا اقدام بفرمایدد',
		statusCode: 500,
	},
};

export default authErrorMessages;
