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
	UnAuthorized: {
		message: '!شما اجازه دسترسی به این بخش را ندارید',
		statusCode: 403,
	},
	BannedUser: {
		message: 'اکانت کاربری شما غیرفعال است، لطفا با پشتیبانی سایت تماس بگیرید',
		statusCode: 403,
	},
};

export default authErrorMessages;
