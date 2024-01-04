import config from 'config';
import Kavenegar from 'kavenegar';

export default async function KavenegarSmsSender(receiverMobile, otpCode) {
	const myApiKey = config.get('kavenegar.apiKey');
	const api = Kavenegar.KavenegarApi({ apikey: myApiKey });

	const sentResult = new Promise((resolve, reject) =>
		api.Send(
			{
				message: `کد تایید شماره موبایل در سایت :
	            ${otpCode}`,
				sender: '10008663',
				receptor: receiverMobile,
			},
			async function (response, status) {
				if (status == 200) {
					resolve(200);
				} else {
					reject(status);
				}
			}
		)
	);
	return await sentResult;
}
