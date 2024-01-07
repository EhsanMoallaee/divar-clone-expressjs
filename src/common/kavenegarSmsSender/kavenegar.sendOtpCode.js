import config from 'config';
import Kavenegar from 'kavenegar';

export default async function KavenegarSmsSender(receiverMobile, otpCode) {
	const apikey = process.env.KAVENEGAR_API_KEY;
	const api = Kavenegar.KavenegarApi({ apikey });
	const sender = config.get('kaveNegarSenderNumber');

	// eslint-disable-next-line no-unused-vars
	const sentResult = new Promise((resolve, reject) =>
		api.Send(
			{
				message: `کد تایید شماره موبایل شما :
	            ${otpCode}`,
				sender,
				receptor: receiverMobile,
			},
			async function (response, status) {
				resolve(status);
			}
		)
	);
	return await sentResult;
}
