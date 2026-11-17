import moment from 'moment';

export function toDateInput(timestamp) {
    return timestamp ? moment.utc(timestamp).format('YYYY-MM-DD') : '';
}

export function startOfDay(dateInput) {
    return moment.utc(dateInput, 'YYYY-MM-DD', true).toISOString();
}

export function endOfDay(dateInput) {
    return moment.utc(dateInput, 'YYYY-MM-DD', true).add(1, 'day').toISOString();
}

export function bannerStatus(banner, now = new Date()) {
    if (new Date(banner.showUntil) <= now) {
        return 'Expired';
    }

    if (!banner.image) {
        return 'No image';
    }

    return new Date(banner.showFrom) > now ? 'Scheduled' : 'Live';
}
