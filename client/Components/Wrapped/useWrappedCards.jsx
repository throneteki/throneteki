import React from 'react';
import '@fontsource/cinzel/600.css';
import '@fontsource/cinzel/700.css';

import Logo from '../../assets/img/main_header_logo.png';
import useStatsFormat from '../Stats/useStatsFormat';
import { MinGamesForRates } from '../Stats/MonthlyStats';
import { localHours } from './localHours';

// Ranks are only worth boasting about in the top half
const MaxRankShown = 50;

const FactionColours = {
    baratheon: '#8a7d12',
    greyjoy: '#1d5f7a',
    lannister: '#8f0105',
    martell: '#a8620f',
    thenightswatch: '#3a3a3a',
    stark: '#5b6470',
    targaryen: '#7d1111',
    tyrell: '#2f6b0b'
};

// Times of day, in the viewer's local hours
const TimesOfDay = [
    {
        from: 0,
        to: 5,
        name: 'Night owl',
        description: 'Most of your games started after midnight.',
        background: 'linear-gradient(to bottom, #020617, #1e1b4b, #312e81)'
    },
    {
        from: 5,
        to: 12,
        name: 'Early riser',
        description: 'You did most of your scheming before noon.',
        background: 'linear-gradient(to bottom, #fb923c, #db2777, #4c1d95)'
    },
    {
        from: 12,
        to: 18,
        name: 'Afternoon schemer',
        description: 'Most of your games were in the afternoon.',
        background: 'linear-gradient(to bottom, #0284c7, #0369a1, #1e3a8a)'
    },
    {
        from: 18,
        to: 24,
        name: 'Evening regular',
        description: 'The evening is when you sit down to play.',
        background: 'linear-gradient(to bottom, #7c2d12, #581c87, #0f172a)'
    }
];

export const Kicker = ({ children }) => (
    <div className="font-['Cinzel'] text-[4.4cqw] font-bold uppercase leading-[1.2] tracking-[0.14em] text-white/80">
        {children}
    </div>
);

export const Big = ({ children, size = 'text-[24cqw]', style }) => (
    <div
        className={`font-['Cinzel'] font-semibold leading-[1.05] text-white ${size}`}
        style={style}
    >
        {children}
    </div>
);

// Cinzel's capitals are wide, so long names are made smaller to fit on one line rather than breaking mid-word
const nameSize = (name, max) => ({
    fontSize: `${Math.min(max, 80 / Math.max(name.length, 1))}cqw`
});

export const Body = ({ children, className = '' }) => (
    <p className={`m-0 text-[5cqw] leading-snug text-white/90 ${className}`}>{children}</p>
);

export const Pill = ({ children }) => (
    <span className='inline-block w-fit rounded-full bg-black/30 px-[3.5cqw] py-[1.4cqw] text-[3.8cqw] font-semibold leading-[1.2] text-white'>
        {children}
    </span>
);

export const Fact = ({ label, value }) => (
    <div className='flex min-w-0 flex-col gap-[0.5cqw]'>
        <span className='text-[3.6cqw] uppercase leading-[1.2] tracking-wider text-white/65'>
            {label}
        </span>
        <span className='break-words text-[7cqw] font-semibold leading-tight text-white'>
            {value}
        </span>
    </div>
);

const useWrappedCards = (wrapped, username) => {
    const { number, plural, record, factionName, factionImage, pairingName, cardTitle, formatDay } =
        useStatsFormat();
    const rank = (top, text) =>
        top && top <= MaxRankShown ? <Pill>{text.replace('{rank}', top)}</Pill> : null;

    // The snapshot's end is exclusive
    const lastDay = new Date(Date.parse(`${wrapped.to}T00:00:00Z`) - 86400000)
        .toISOString()
        .slice(0, 10);
    const period = `${formatDay(wrapped.from, { day: 'numeric', month: 'long' })} to ${formatDay(
        lastDay,
        { day: 'numeric', month: 'long' }
    )}`;

    const detailed = wrapped.detailed;
    const detailedFrom = wrapped.site?.detailedFrom;
    const detailedNote =
        detailed && detailedFrom && detailedFrom > wrapped.from
            ? `Since ${formatDay(detailedFrom, { day: 'numeric', month: 'long' })}`
            : null;

    const hours = wrapped.seconds / 3600;
    const busiestMonth = wrapped.byMonth.indexOf(Math.max(...wrapped.byMonth));
    const monthName = (month, style = 'long') =>
        new Date(Date.UTC(wrapped.year, month, 1)).toLocaleDateString(undefined, {
            timeZone: 'UTC',
            month: style
        });
    const maxMonth = Math.max(1, ...wrapped.byMonth);

    // Start times are stored in UTC; show the time of day in the viewer's own time
    const hoursOfPlay = localHours(wrapped.startTimes, wrapped.year);
    const peakHour = hoursOfPlay.indexOf(Math.max(...hoursOfPlay));
    const timeOfDay = TimesOfDay.map((time) => ({
        ...time,
        games: hoursOfPlay.slice(time.from, time.to).reduce((total, count) => total + count, 0)
    })).sort((a, b) => b.games - a.games)[0];
    const formatHour = (hour) =>
        new Date(Date.UTC(2024, 0, 1, hour)).toLocaleTimeString(undefined, {
            hour: 'numeric',
            timeZone: 'UTC'
        });

    const winRate = Math.round((100 * wrapped.wins) / wrapped.games);
    const faction = wrapped.favouriteFaction;
    const pairing = wrapped.topPairing;
    const mvp = detailed?.mvp;
    const plot = detailed?.favouritePlot;

    const story = [];

    story.push({
        key: 'intro',
        background: 'radial-gradient(circle at 50% 35%, #5a3a12 0%, #1d1710 45%, #0a0b0d 100%)',
        content: (
            <div className='flex h-full flex-col items-center justify-center gap-[5cqw] text-center'>
                <img alt='The Iron Throne' className='w-[80cqw]' src={Logo} />
                <Big size='text-[30cqw] text-[#da8a2a]'>{wrapped.year}</Big>
                <Big size='text-[12cqw]'>Wrapped</Big>
                <Body>{username}, here is your year in Westeros.</Body>
                <Pill>{period}</Pill>
            </div>
        )
    });

    story.push({
        key: 'games',
        background: 'linear-gradient(to bottom right, #3b1d8f, #4c1d95, #1e1b4b)',
        content: (
            <div className='flex h-full flex-col justify-center gap-[4cqw]'>
                <Kicker>You played</Kicker>
                <Big>{number(wrapped.games)}</Big>
                <Body>
                    {plural(
                        Math.round(hours),
                        'games, about an hour at the table.',
                        'games, about {count} hours at the table.'
                    )}
                </Body>
                {rank(wrapped.ranks?.games, 'Top {rank}% of players for games played')}
                <div className='mt-[4cqw] flex h-[28cqw] items-end gap-[1.2cqw]'>
                    {wrapped.byMonth.map((count, month) => (
                        <div key={month} className='flex h-full flex-1 flex-col justify-end'>
                            <div
                                className={`rounded-t-[1cqw] ${
                                    month === busiestMonth ? 'bg-[#da8a2a]' : 'bg-white/45'
                                }`}
                                style={{ height: count > 0 ? `${(100 * count) / maxMonth}%` : 0 }}
                            />
                            <div className='pt-[1cqw] text-center text-[3cqw] leading-[1.2] text-white/70'>
                                {monthName(month, 'narrow')}
                            </div>
                        </div>
                    ))}
                </div>
                <Body className='text-[4.2cqw]'>
                    {monthName(busiestMonth)} was your busiest month.
                </Body>
            </div>
        )
    });

    story.push({
        key: 'record',
        background: 'linear-gradient(to bottom right, #065f46, #047857, #022c22)',
        content: (
            <div className='flex h-full flex-col justify-center gap-[4cqw]'>
                <Kicker>Your record</Kicker>
                <Big>{number(wrapped.wins)}</Big>
                <Body>
                    {plural(wrapped.wins, 'win', 'wins')}
                    {' · '}
                    {plural(wrapped.losses, '1 loss', '{count} losses')}
                </Body>
                {wrapped.games >= MinGamesForRates && <Big size='text-[12cqw]'>{winRate}% won</Big>}
                <div className='flex flex-col gap-[2cqw]'>
                    {rank(wrapped.ranks?.wins, 'Top {rank}% of players for wins')}
                    {rank(wrapped.ranks?.winRate, 'Top {rank}% of players for win rate')}
                </div>
            </div>
        )
    });

    if (wrapped.dominantWins > 0 || wrapped.longestWinStreak > 1 || wrapped.fastestWin) {
        story.push({
            key: 'highlights',
            background: 'linear-gradient(to bottom right, #9f1239, #be123c, #431407)',
            content: (
                <div className='flex h-full flex-col justify-center gap-[6cqw]'>
                    <Kicker>Your best moments</Kicker>
                    {wrapped.dominantWins > 0 && (
                        <div className='flex flex-col gap-[2cqw]'>
                            <Big size='text-[20cqw]'>{number(wrapped.dominantWins)}</Big>
                            <Body>
                                {plural(
                                    wrapped.dominantWins,
                                    'dominant win, well clear of your opponents on power.',
                                    'dominant wins, well clear of your opponents on power.'
                                )}
                            </Body>
                            {rank(wrapped.ranks?.dominantWins, 'Top {rank}% of players')}
                        </div>
                    )}
                    <div className='grid grid-cols-2 gap-[4cqw]'>
                        {wrapped.longestWinStreak > 1 && (
                            <Fact
                                label='Win streak'
                                value={`${wrapped.longestWinStreak} in a row`}
                            />
                        )}
                        {wrapped.fastestWin && (
                            <Fact
                                label='Fastest win'
                                value={plural(
                                    wrapped.fastestWin.rounds,
                                    '1 round',
                                    '{count} rounds'
                                )}
                            />
                        )}
                    </div>
                </div>
            )
        });
    }

    if (faction) {
        story.push({
            key: 'faction',
            background: `radial-gradient(circle at 50% 40%, ${
                FactionColours[faction.faction] || '#444'
            } 0%, #0a0b0d 85%)`,
            content: (
                <div className='flex h-full flex-col items-center justify-center gap-[5cqw] text-center'>
                    <Kicker>Your faction</Kicker>
                    {factionImage(faction.faction) && (
                        <img
                            alt=''
                            className='w-[45cqw] drop-shadow-[0_2cqw_6cqw_rgba(0,0,0,0.6)]'
                            src={factionImage(faction.faction)}
                        />
                    )}
                    <Big size='text-[13cqw]'>{factionName(faction.faction)}</Big>
                    <Body>
                        {plural(faction.games, '1 game', '{count} games')},{' '}
                        {record(faction.wins, faction.games)}.
                    </Body>
                    {wrapped.site?.topFaction === faction.faction && (
                        <Pill>The most played faction on the site, too</Pill>
                    )}
                </div>
            )
        });
    }

    if (pairing && pairing.agendas.length > 0) {
        story.push({
            key: 'pairing',
            background: 'linear-gradient(to bottom, #0f172a, #1e3a5f, #0c4a6e)',
            content: (
                <div className='flex h-full flex-col justify-center gap-[5cqw]'>
                    <Kicker>Your deck of the year</Kicker>
                    {factionImage(pairing.faction) && (
                        <img alt='' className='w-[17cqw]' src={factionImage(pairing.faction)} />
                    )}
                    <Big size='text-[10cqw]'>
                        {factionName(pairing.faction)}
                        <br />
                        {pairingName(pairing)}
                    </Big>
                    <div className='grid grid-cols-2 gap-[3cqw]'>
                        <Fact label='Games' value={number(pairing.games)} />
                        <Fact label='Record' value={record(pairing.wins, pairing.games)} />
                    </div>
                    {wrapped.pairingCount > 1 && (
                        <Body className='text-[4.2cqw]'>
                            One of {wrapped.pairingCount} faction and agenda pairings you played
                            this year.
                        </Body>
                    )}
                </div>
            )
        });
    }

    if (mvp) {
        story.push({
            key: 'mvp',
            background: 'linear-gradient(to bottom, #1c1917, #44403c)',
            detailed: true,
            content: (
                <div className='flex h-full flex-col items-center justify-center gap-[4cqw] text-center'>
                    <Kicker>Your MVP</Kicker>
                    <img
                        alt={cardTitle(mvp.code)}
                        className='w-[56cqw] rounded-[3cqw] shadow-[0_3cqw_10cqw_rgba(0,0,0,0.6)]'
                        src={`/img/cards/${mvp.code}.png`}
                    />
                    <Big size='text-[10cqw]'>{cardTitle(mvp.code)}</Big>
                    <Body>
                        Attacked {number(mvp.attacked)} times and defended {number(mvp.defended)}{' '}
                        times.
                    </Body>
                </div>
            )
        });
    }

    if (detailed) {
        story.push({
            key: 'challenges',
            background: 'linear-gradient(to bottom right, #b45309, #9a3412, #431407)',
            detailed: true,
            content: (
                <div className='flex h-full flex-col justify-center gap-[5cqw]'>
                    <Kicker>Power</Kicker>
                    <Big>{number(detailed.powerGained)}</Big>
                    <Body>power gained, {number(detailed.powerFromRenown)} of it from renown.</Body>
                    <div className='grid grid-cols-2 gap-[4cqw]'>
                        <Fact
                            label='Military won'
                            value={number(detailed.challengesWon.military)}
                        />
                        <Fact
                            label='Intrigue won'
                            value={number(detailed.challengesWon.intrigue)}
                        />
                        <Fact label='Power won' value={number(detailed.challengesWon.power)} />
                        <Fact label='Gold gained' value={number(detailed.goldGained)} />
                    </div>
                    {plot && (
                        <Body className='text-[4.2cqw]'>
                            Your favourite plot was {cardTitle(plot.code)}, revealed{' '}
                            {plural(plot.revealed, 'once', '{count} times')}.
                        </Body>
                    )}
                </div>
            )
        });
    }

    if (wrapped.rival) {
        story.push({
            key: 'opponents',
            background: 'linear-gradient(to bottom right, #1e293b, #334155, #0f172a)',
            content: (
                <div className='flex h-full flex-col justify-center gap-[6cqw]'>
                    <Kicker>Your rival</Kicker>
                    <div className='flex flex-col gap-[2cqw]'>
                        <Big size='whitespace-nowrap' style={nameSize(wrapped.rival.name, 13)}>
                            {wrapped.rival.name}
                        </Big>
                        <Body>
                            {wrapped.rival.games} games together. You won {wrapped.rival.wins}.
                        </Body>
                    </div>
                    {wrapped.nemesis && wrapped.nemesis.name !== wrapped.rival.name && (
                        <div className='flex flex-col gap-[2cqw]'>
                            <Kicker>Your nemesis</Kicker>
                            <Big
                                size='whitespace-nowrap'
                                style={nameSize(wrapped.nemesis.name, 10)}
                            >
                                {wrapped.nemesis.name}
                            </Big>
                            <Body>
                                {plural(
                                    wrapped.nemesis.lossesTo,
                                    'Beat you once.',
                                    'Beat you {count} times.'
                                )}
                            </Body>
                        </div>
                    )}
                    <Body className='text-[4.2cqw]'>
                        {plural(
                            wrapped.opponentCount,
                            'You played one opponent this year.',
                            'You played {count} different opponents this year.'
                        )}
                    </Body>
                </div>
            )
        });
    }

    story.push({
        key: 'time',
        background: timeOfDay.background,
        content: (
            <div className='flex h-full flex-col justify-center gap-[5cqw]'>
                <Kicker>When you play</Kicker>
                <Big size='text-[15cqw]'>{timeOfDay.name}</Big>
                <Body>{timeOfDay.description}</Body>
                <div className='grid grid-cols-2 gap-[4cqw]'>
                    <Fact label='Peak hour' value={formatHour(peakHour)} />
                    <Fact label='Busiest month' value={monthName(busiestMonth)} />
                </div>
            </div>
        )
    });

    story.push({
        key: 'summary',
        background: 'radial-gradient(circle at 50% 0%, #4a320b 0%, #16120a 55%, #0a0b0d 100%)',
        content: (
            <div className='flex h-full flex-col justify-center gap-[5cqw]'>
                <div className='flex flex-col gap-[1cqw]'>
                    <Kicker>{wrapped.year} Wrapped</Kicker>
                    <Big size='whitespace-nowrap' style={nameSize(username, 11)}>
                        {username}
                    </Big>
                </div>
                <div className='grid grid-cols-2 gap-x-[4cqw] gap-y-[5cqw]'>
                    <Fact label='Games' value={number(wrapped.games)} />
                    <Fact label='Record' value={record(wrapped.wins, wrapped.games)} />
                    <Fact label='Dominant wins' value={number(wrapped.dominantWins)} />
                    <Fact label='Hours played' value={number(hours)} />
                    {faction && <Fact label='Faction' value={factionName(faction.faction)} />}
                    {mvp && <Fact label='MVP' value={cardTitle(mvp.code)} />}
                </div>
                {pairing && pairing.agendas.length > 0 && (
                    <Fact label='Deck of the year' value={pairingName(pairing)} />
                )}
                <Pill>{timeOfDay.name}</Pill>
            </div>
        )
    });

    return story.map((card) => ({ ...card, note: card.detailed ? detailedNote : null }));
};

export default useWrappedCards;
