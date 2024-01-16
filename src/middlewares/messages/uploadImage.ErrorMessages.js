const uploadImageErrorMessages = {
	FieldIsNotAllowed: {
		message: 'لطفا با پشتیبانی سایت تماس بگیرید',
		statusCode: 403,
	},
	WrongImageFileFormat: {
		message: 'میباشند png , jpg , jpeg , svg  فرمت های مجاز برای آپلود تصویر',
		statusCode: 415,
	},
	MaxImageFileSizeError: {
		message: 'فایل تصویر نمیتواند بیشتر از 3 مگابایت باشد',
		statusCode: 413,
	},
	UnknownProblem: {
		message:
			'مشکلی درفایل ارسالی وجود دارد، لطفا در انتخاب فایل دقت فرمایید ، درصورت برطرف نشدن مشکل با پشتیبانی تماس بگیرید',
		statusCod: 400,
	},
};

export default uploadImageErrorMessages;
