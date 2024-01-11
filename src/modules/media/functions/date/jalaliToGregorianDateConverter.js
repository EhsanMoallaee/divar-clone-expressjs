
export default function jalali_to_gregorian(jalaliYear = 1400 , jalaliMonth , jalaliDay) {
    let sal_a , yearInGregorian , monthInGregorian , dayInGregorian , days;
    jalaliYear += 1595;
    days = -355668 + (365 * jalaliYear) + (~~(jalaliYear / 33) * 8) + ~~(((jalaliYear % 33) + 3) / 4) + jalaliDay + ((jalaliMonth < 7) ? (jalaliMonth - 1) * 31 : ((jalaliMonth - 7) * 30) + 186);
    yearInGregorian = 400 * ~~(days / 146097);
    days %= 146097;
    if (days > 36524) {
    yearInGregorian += 100 * ~~(--days / 36524);
    days %= 36524;
    if (days >= 365) days++;
    }
    yearInGregorian += 4 * ~~(days / 1461);
    days %= 1461;
    if (days > 365) {
        yearInGregorian += ~~((days - 1) / 365);
    days = (days - 1) % 365;
    }
    dayInGregorian = days + 1;
    sal_a = [0, 31, ((yearInGregorian % 4 === 0 && yearInGregorian % 100 !== 0) || (yearInGregorian % 400 === 0)) ? 29 : 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31];
    for (monthInGregorian = 0; monthInGregorian < 13 && dayInGregorian > sal_a[monthInGregorian]; monthInGregorian++) dayInGregorian -= sal_a[monthInGregorian];
    let date = yearInGregorian + "/" + monthInGregorian + "/" + dayInGregorian;
    date = new Date(date);
    date = date.setUTCHours(0,0,0,0);
    date = new Date(date);
    return {date , yearInGregorian , monthInGregorian , dayInGregorian};
}
