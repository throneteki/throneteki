import { useGetCardsQuery } from '../../redux/middleware/api';
import { Constants } from '../../constants';

const FactionNames = Object.fromEntries(
    Constants.Factions.map((faction) => [faction.value, faction.name])
);

export const WinReasonLabels = {
    power: 'Reached 15 power',
    concede: 'Concession',
    remaining: 'Last player left',
    time: 'On time'
};

/**
 * Formatting shared by the stats and Wrapped pages
 */
const useStatsFormat = () => {
    const { data: cards } = useGetCardsQuery({});

    return {
        number: (value) => Math.round(value).toLocaleString(),
        plural: (count, one, other) =>
            (count === 1 ? one : other).replace('{count}', count.toLocaleString()),
        record: (wins, games) => `${wins}-${games - wins}`,
        factionName: (faction) => FactionNames[faction] || 'Unknown faction',
        factionImage: (faction) => Constants.FactionsImagePaths[faction],
        pairingName: (pairing) =>
            pairing.agendas.length > 0 ? pairing.agendas.join(' / ') : 'No agenda',
        cardName: (code) => cards?.[code]?.label || cards?.[code]?.name || code,
        cardTitle: (code) => cards?.[code]?.name || code,
        // Days are worked out in UTC on the server, so format them as UTC too
        formatDay: (day, options) =>
            new Date(`${day}T00:00:00Z`).toLocaleDateString(undefined, {
                timeZone: 'UTC',
                ...options
            })
    };
};

export default useStatsFormat;
