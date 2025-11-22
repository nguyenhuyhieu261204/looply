export function timeAgo(input, locale = "vi") {
    const now = new Date();
    let date;

    if (input instanceof Date) {
        date = input;
    } else if (typeof input === "number") {
        date = new Date(input);
    } else {
        date = new Date(input);
    }

    const diffMs = now - date;
    const seconds = Math.floor(diffMs / 1000);
    const minutes = Math.floor(seconds / 60);
    const hours = Math.floor(minutes / 60);
    const days = Math.floor(hours / 24);
    const months = Math.floor(days / 30);
    const years = Math.floor(days / 365);

    const rtf = new Intl.RelativeTimeFormat(locale, { numeric: "auto" });

    if (years > 0) return rtf.format(-years, "year");
    if (months > 0) return rtf.format(-months, "month");
    if (days > 0) return rtf.format(-days, "day");
    if (hours > 0) return rtf.format(-hours, "hour");
    if (minutes > 0) return rtf.format(-minutes, "minute");
    return rtf.format(-seconds, "second");
}