import config from 'config';
import Kavenegar from 'kavenegar';

export default async function KavenegarSmsSender(receiverMobile, otpCode) {
	const myApiKey = config.get('kavenegar.apiKey');
	const api = Kavenegar.KavenegarApi({ apikey: myApiKey });

	const sentResult = new Promise((resolve, reject) =>
		api.Send(
			{
				message: `کد تایید شماره موبایل شما :
	            ${otpCode}`,
				sender: config.get('kavenegar.sender'),
				receptor: receiverMobile,
			},
			async function (response, status) {
				resolve(status);
			}
		)
	);
	return await sentResult;
}
