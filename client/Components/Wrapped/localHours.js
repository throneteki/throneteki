// Start times are UTC by month and quarter of an hour; each month uses its own offset, so daylight saving and half or
// quarter hour timezones come out right
export const localHours = (
    startTimes,
    year,
    offsetMinutes = (date) => -date.getTimezoneOffset()
) => {
    const hours = new Array(24).fill(0);

    startTimes.forEach((quarters, month) => {
        // Mid-month, so a daylight saving change only affects the days on the wrong side of it
        const offset = offsetMinutes(new Date(Date.UTC(year, month, 15, 12)));

        quarters.forEach((count, quarter) => {
            const minute = (((quarter * 15 + offset) % 1440) + 1440) % 1440;
            hours[Math.floor(minute / 60)] += count;
        });
    });

    return hours;
};
