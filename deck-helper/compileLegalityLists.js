import moment from 'moment';
import startCase from 'lodash.startcase';

const defaultVariant = { joust: 'standard', melee: 'standard', draft: 'valyrian' };

export function compileLegalityLists(lists) {
    return [...lists]
        .sort((a, b) => new Date(b.date) - new Date(a.date))
        .flatMap((legality) =>
            legality.formats.map(({ name: format, variant, banned = [], ...details }) => {
                variant = variant ?? defaultVariant[format];
                return {
                    _id: `${legality.code}_${format}_${variant}`,
                    format,
                    variant,
                    name: `${startCase(`${format} ${variant}`)} ${legality.version}`,
                    version: legality.version,
                    date: legality.date,
                    issuer: legality.issuer,
                    official: true,
                    active: false,
                    restricted: [],
                    pods: [],
                    banned: [...new Set([...banned, ...(legality.bannedCards ?? [])])],
                    ...details
                };
            })
        );
}

export function setActiveLegalityLists(compiled, today = moment().startOf('day')) {
    const closest = {};
    for (const item of compiled) {
        const date = moment(item.date, 'YYYY-MM-DD');
        if (!date.isSameOrBefore(today)) {
            continue;
        }
        const key = `${item.format}__${item.variant}`;
        if (!closest[key] || date.isAfter(moment(closest[key].date, 'YYYY-MM-DD'))) {
            closest[key] = item;
        }
    }
    for (const item of Object.values(closest)) {
        item.active = true;
    }
    return compiled;
}
