import React from 'react';

import BarChart from './BarChart';
import StatTile from './StatTile';
import useStatsFormat, { WinReasonLabels } from './useStatsFormat';

// Rates over fewer games don't mean much
export const MinGamesForRates = 5;

const ChallengeTypes = ['military', 'intrigue', 'power'];
const ChallengeLabels = { military: 'Military', intrigue: 'Intrigue', power: 'Power' };

const Section = ({ title, note, children }) => (
    <section className='flex flex-col gap-3'>
        <div className='flex flex-wrap items-baseline justify-between gap-x-3 border-b border-default-300/50 pb-1'>
            <h2 className='text-xl font-semibold leading-7'>{title}</h2>
            {note && <span className='text-sm text-default-500'>{note}</span>}
        </div>
        {children}
    </section>
);

const TileGrid = ({ children }) => (
    <div className='grid grid-cols-2 gap-2 sm:grid-cols-3 lg:grid-cols-6'>{children}</div>
);

const Table = ({ columns, rows }) => (
    <table className='w-full table-fixed'>
        <thead className='text-left text-sm text-default-500'>
            <tr>
                {columns.map((column, index) => (
                    <th
                        key={column}
                        className={`pb-1 font-normal ${index > 0 ? 'w-20 text-right' : ''}`}
                    >
                        {column}
                    </th>
                ))}
            </tr>
        </thead>
        <tbody className='tabular-nums'>
            {rows.map(({ key, cells }) => (
                <tr key={key} className='border-t border-default-300/30'>
                    {cells.map((cell, index) => (
                        <td
                            key={index}
                            className={index > 0 ? 'py-1 text-right' : 'max-w-0 truncate py-1 pr-2'}
                        >
                            {cell}
                        </td>
                    ))}
                </tr>
            ))}
        </tbody>
    </table>
);

const MonthlyStats = ({ month, stats }) => {
    const { number, plural, record, factionName, factionImage, pairingName, cardName, formatDay } =
        useStatsFormat();

    const percent = (count, total) => Math.round((100 * count) / total);
    const rate = (wins, games) => (games >= MinGamesForRates ? `${percent(wins, games)}% won` : '');
    const gamesText = (count) => plural(count, '1 game', '{count} games');
    // 2024-01-01 was a Monday
    const weekdayName = (isoDay) => formatDay(`2024-01-0${isoDay}`, { weekday: 'short' });

    if (stats.games === 0) {
        return <p className='py-6 text-center'>No games this month.</p>;
    }

    const [year, monthNumber] = month.split('-').map(Number);
    const daysInMonth = new Date(Date.UTC(year, monthNumber, 0)).getUTCDate();
    const dayBars = Array.from({ length: daysInMonth }, (_, index) => {
        const day = `${month}-${String(index + 1).padStart(2, '0')}`;
        return {
            key: day,
            value: stats.byDay[day] || 0,
            label: String(index + 1),
            axisLabel: index === 0 || (index + 1) % 7 === 0
        };
    });
    const busiestDay = dayBars.reduce((best, bar) => (bar.value > best.value ? bar : best));

    const weekdayBars = [1, 2, 3, 4, 5, 6, 7].map((isoDay) => ({
        key: String(isoDay),
        value: stats.byWeekday[isoDay - 1],
        label: weekdayName(isoDay),
        axisLabel: true
    }));

    const hourBars = stats.byHour.map((value, hour) => ({
        key: String(hour),
        value,
        label: String(hour).padStart(2, '0'),
        axisLabel: hour % 6 === 0
    }));

    const hours = stats.seconds / 3600;
    const detailed = stats.detailed;
    const winReasons = Object.entries(stats.winReasons).filter(([, count]) => count > 0);

    return (
        <div className='flex flex-col gap-6'>
            <TileGrid>
                <StatTile
                    label='Games'
                    value={number(stats.games)}
                    detail={`${hours < 10 ? hours.toFixed(1) : number(hours)} hours played`}
                />
                <StatTile
                    label='Record'
                    value={record(stats.wins, stats.games)}
                    detail={rate(stats.wins, stats.games)}
                />
                <StatTile
                    label='Dominant wins'
                    value={number(stats.dominantWins)}
                    detail={
                        stats.games >= MinGamesForRates
                            ? `${percent(stats.dominantWins, stats.games)}% of games`
                            : ''
                    }
                />
                <StatTile label='Longest win streak' value={number(stats.longestWinStreak)} />
                <StatTile
                    label='Fastest win'
                    value={
                        stats.fastestWin
                            ? plural(stats.fastestWin.rounds, '1 round', '{count} rounds')
                            : 'None'
                    }
                    detail={
                        stats.fastestWin &&
                        formatDay(stats.fastestWin.day, { day: 'numeric', month: 'short' })
                    }
                />
                <StatTile
                    label='Melee games'
                    value={number(stats.meleeGames)}
                    detail={`${number(stats.games - stats.meleeGames)} joust`}
                />
            </TileGrid>

            {winReasons.length > 0 && (
                <p className='text-sm leading-5 text-default-500'>
                    How you won:{' '}
                    {winReasons
                        .map(([reason, count]) => `${WinReasonLabels[reason] || reason} ${count}`)
                        .join(' · ')}
                </p>
            )}

            <Section title='When you played' note='Times are UTC'>
                <BarChart
                    title='Games per day'
                    bars={dayBars}
                    describe={(bar) =>
                        `${formatDay(bar.key, { day: 'numeric', month: 'short' })}: ${gamesText(bar.value)}`
                    }
                    summary={`Busiest: ${formatDay(busiestDay.key, {
                        day: 'numeric',
                        month: 'short'
                    })} (${gamesText(busiestDay.value)})`}
                />
                <div className='grid grid-cols-1 gap-6 md:grid-cols-2'>
                    <BarChart
                        title='By day of the week'
                        bars={weekdayBars}
                        describe={(bar) => `${bar.label}: ${gamesText(bar.value)}`}
                    />
                    <BarChart
                        title='By hour'
                        bars={hourBars}
                        describe={(bar) => `${bar.label}:00: ${gamesText(bar.value)}`}
                    />
                </div>
            </Section>

            <div className='grid grid-cols-1 gap-6 lg:grid-cols-2'>
                <Section title='Factions'>
                    <Table
                        columns={['Faction', 'Games', 'Record', 'Dominant']}
                        rows={stats.factions.map((faction) => ({
                            key: faction.faction,
                            cells: [
                                <span key='name' className='flex items-center gap-2'>
                                    {factionImage(faction.faction) && (
                                        <img
                                            className='h-5 w-5'
                                            src={factionImage(faction.faction)}
                                            alt=''
                                        />
                                    )}
                                    {factionName(faction.faction)}
                                </span>,
                                faction.games,
                                record(faction.wins, faction.games),
                                faction.dominantWins
                            ]
                        }))}
                    />
                    <Table
                        columns={['Agendas', 'Games', 'Record', 'Dominant']}
                        rows={stats.pairings.map((pairing) => ({
                            key: [pairing.faction, ...pairing.agendas].join('|'),
                            cells: [
                                <span key='name' className='flex items-center gap-2'>
                                    {factionImage(pairing.faction) && (
                                        <img
                                            className='h-5 w-5'
                                            src={factionImage(pairing.faction)}
                                            alt={factionName(pairing.faction)}
                                        />
                                    )}
                                    <span className='truncate'>{pairingName(pairing)}</span>
                                </span>,
                                pairing.games,
                                record(pairing.wins, pairing.games),
                                pairing.dominantWins
                            ]
                        }))}
                    />
                </Section>

                <Section title='Opponents'>
                    <div className='grid grid-cols-2 gap-2'>
                        <StatTile
                            label='Most played'
                            value={stats.rival ? stats.rival.name : 'None'}
                            detail={
                                stats.rival &&
                                `${gamesText(stats.rival.games)} · ${record(stats.rival.wins, stats.rival.games)}`
                            }
                        />
                        <StatTile
                            label='Nemesis'
                            value={stats.nemesis ? stats.nemesis.name : 'None'}
                            detail={
                                stats.nemesis
                                    ? plural(
                                          stats.nemesis.lossesTo,
                                          'Beat you once',
                                          'Beat you {count} times'
                                      )
                                    : 'Nobody beat you'
                            }
                        />
                    </div>
                    <p className='text-sm leading-5'>
                        {plural(
                            stats.opponentCount,
                            'You played one opponent.',
                            'You played {count} different opponents.'
                        )}
                        {stats.winReasons.concede > 0 &&
                            ' ' +
                                plural(
                                    stats.winReasons.concede,
                                    'Opponents conceded 1 game to you.',
                                    'Opponents conceded {count} games to you.'
                                )}
                    </p>
                    {stats.decks.length > 0 && (
                        <>
                            <h3 className='m-0 font-semibold'>Decks</h3>
                            <Table
                                columns={['Deck', 'Games', 'Record', 'Dominant']}
                                rows={stats.decks.map((deck) => ({
                                    key: String(deck.deckId),
                                    cells: [
                                        deck.name || 'Deleted deck',
                                        deck.games,
                                        record(deck.wins, deck.games),
                                        deck.dominantWins
                                    ]
                                }))}
                            />
                        </>
                    )}
                </Section>
            </div>

            {detailed && (
                <Section
                    title='In the game'
                    note={
                        detailed.games < stats.games
                            ? `From ${detailed.games} of your ${stats.games} games`
                            : undefined
                    }
                >
                    <TileGrid>
                        <StatTile
                            label='Power gained'
                            value={number(detailed.powerGained)}
                            detail={`${number(detailed.powerFromRenown)} from renown`}
                        />
                        <StatTile label='Gold gained' value={number(detailed.goldGained)} />
                        <StatTile
                            label='Cards marshalled'
                            value={number(detailed.cardsMarshalled)}
                            detail={`${number(detailed.cardsDrawn)} drawn`}
                        />
                        <StatTile label='Events played' value={number(detailed.eventsPlayed)} />
                        <StatTile
                            label='Dominance won'
                            value={number(detailed.dominanceWon)}
                            detail={`Initiative ${number(detailed.initiativeWon)} times`}
                        />
                        <StatTile
                            label='Your characters killed'
                            value={number(detailed.charactersKilled)}
                        />
                    </TileGrid>

                    <div className='grid grid-cols-1 gap-6 lg:grid-cols-2'>
                        <div className='flex flex-col gap-2'>
                            <h3 className='m-0 font-semibold'>Challenges</h3>
                            <Table
                                columns={['Type', 'Initiated', 'Won', 'Lost']}
                                rows={ChallengeTypes.map((type) => ({
                                    key: type,
                                    cells: [
                                        ChallengeLabels[type],
                                        detailed.challengesInitiated[type],
                                        detailed.challengesWon[type],
                                        detailed.challengesLost[type]
                                    ]
                                }))}
                            />
                            <p className='text-sm leading-5'>
                                {plural(
                                    detailed.unopposedChallengesWon,
                                    'You won 1 challenge unopposed.',
                                    'You won {count} challenges unopposed.'
                                )}
                                {detailed.favouritePlot &&
                                    ` Your most revealed plot was ${cardName(
                                        detailed.favouritePlot.code
                                    )} (${plural(
                                        detailed.favouritePlot.revealed,
                                        'once',
                                        '{count} times'
                                    )}).`}
                            </p>
                        </div>

                        <div className='flex flex-col gap-2'>
                            <h3 className='m-0 font-semibold'>Most played cards</h3>
                            {detailed.mvp && (
                                <p className='text-sm leading-5'>
                                    MVP: {cardName(detailed.mvp.code)} attacked{' '}
                                    {detailed.mvp.attacked} and defended {detailed.mvp.defended}{' '}
                                    times
                                </p>
                            )}
                            <Table
                                columns={['Card', 'Played', 'Attacked', 'Defended']}
                                rows={detailed.cards.map((card) => ({
                                    key: card.code,
                                    cells: [
                                        cardName(card.code),
                                        card.marshalled + card.played,
                                        card.attacked,
                                        card.defended
                                    ]
                                }))}
                            />
                        </div>
                    </div>
                </Section>
            )}
        </div>
    );
};

export default MonthlyStats;
