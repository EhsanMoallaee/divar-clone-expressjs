export default function gregorianToJalali(gy, gm, gd) {
	if (!gy || !gm || !gd) {
		const today = new Date();
		gy = today.getFullYear();
		gm = today.getMonth() + 1;
		gd = today.getDate();
	}
	const g_d_m = [0, 31, 59, 90, 120, 151, 181, 212, 243, 273, 304, 334];
	let jy = 0;
	if (gy > 1600) {
		jy = 979;
		gy -= 1600;
	} else {
		jy = 0;
		gy -= 621;
	}
	let gy2 = gm > 2 ? gy + 1 : gy;
	let days =
		365 * gy +
		parseInt((gy2 + 3) / 4) -
		parseInt((gy2 + 99) / 100) +
		parseInt((gy2 + 399) / 400) -
		80 +
		gd +
		g_d_m[gm - 1];
	jy += 33 * parseInt(days / 12053);
	days %= 12053;
	jy += 4 * parseInt(days / 1461);
	days %= 1461;
	if (days > 365) {
		jy += parseInt((days - 1) / 365);
		days = (days - 1) % 365;
	}
	let jm = days < 186 ? 1 + parseInt(days / 31) : 7 + parseInt((days - 186) / 30);
	let jd = 1 + (days < 186 ? days % 31 : (days - 186) % 30);

	const year = Number(jy.toString());
	const month = Number(jm < 10 ? '0' + jm.toString() : jm.toString());
	const day = Number(jd < 10 ? '0' + jd.toString() : jd.toString());
	return { year, month, day };
}
