const imageErrorMessages = {
	FieldIsNotAllowed: {
		message: 'لطفا با پشتیبانی سایت تماس بگیرید',
		statusCode: 403,
	},
	WrongImageFileFormat: {
		message: 'میباشند png , jpg , jpeg , gif , svg  فرمت های مجاز برای آپلود تصویر',
		statusCode: 415,
	},
	MaxImageFilesizeAllowedIs2mb: {
		message: 'فایل تصویر نمیتواند بیشتر از 2 مگابایت باشد',
		statusCode: 413,
	},
	UnknownProblem: {
		messag: 'مشکلی درفایل ارسالی وجود دارد، لطفا در انتخاب فایل دقت فرمایید ، درصورت برطرف نشدن مشکل با پشتیبانی تماس بگیرید',
		statusCod: 400,
	},
	ThumbAndMediumImageSizeDidntFound: {
		message: 'سایزهای دیگر تصویر انتخاب شده برای محصول مورد نظر پیدا نشد',
		statusCode: 404,
	},
	ImageNotFound: {
		message: 'تصویر مورد نظر پیدا نشد',
		statusCode: 404,
	},
	SelectedImageDidntFound: {
		message: 'تصویر انتخاب شده برای این آیتم پیدا نشد',
		statusCode: 404,
	},
	OtherSizesForSelectedImageDidntFound: {
		message: 'سایزهای دیگر تصویر انتخاب شده برای محصول پیدا نشد',
		statusCode: 404,
	},
	GalleryImageDidntFound: {
		message: 'تصویر انتخاب شده برای گالری تصاویر پیدا نشد',
		statusCode: 404,
	},
	AttachedFileMissing: {
		message: 'لطفا فایل مورد نظر را آپلود نمایید',
		statusCode: 400,
	},
};

export default imageErrorMessages;
