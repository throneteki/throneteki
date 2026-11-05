import React from 'react';
import '@fontsource/cinzel/600.css';
import '@fontsource/cinzel/700.css';
import '@fontsource/eb-garamond/400.css';
import '@fontsource/eb-garamond/400-italic.css';
import '@fontsource/eb-garamond/600.css';

import useStatsFormat from '../Stats/useStatsFormat';
import { MinGamesForRates } from '../Stats/MonthlyStats';
import { localHours } from './localHours';

// Ranks are only worth boasting about in the top half
const MaxRankShown = 50;

export const Ink = '#2a1f14';
export const Gold = '#8a6424';

const FactionColours = {
    baratheon: '#a08a12',
    greyjoy: '#1d5f7a',
    lannister: '#8f0105',
    martell: '#b0620f',
    thenightswatch: '#2f2f2f',
    stark: '#56606c',
    targaryen: '#7d1111',
    tyrell: '#3d7a12'
};

const ChallengeColours = { military: '#a81d23', intrigue: '#0b6b3c', power: '#2a3478' };

// Times of day, in the viewer's local hours
const TimesOfDay = [
    {
        from: 0,
        to: 5,
        name: 'Night owl',
        description: 'Most battles began in the small hours, long after the castle slept.',
        accent: '#2a3478'
    },
    {
        from: 5,
        to: 12,
        name: 'Early riser',
        description: 'Most battles were joined before the noon bell.',
        accent: '#b0620f'
    },
    {
        from: 12,
        to: 18,
        name: 'Afternoon schemer',
        description: 'Most battles were fought in the long afternoons.',
        accent: '#1d5f7a'
    },
    {
        from: 18,
        to: 24,
        name: 'Evening regular',
        description: 'Most battles were fought by candlelight, as evening fell.',
        accent: '#7d1111'
    }
];

export const Kicker = ({ children }) => (
    <div
        className="font-['Cinzel'] text-[4cqw] font-bold uppercase leading-[1.2] tracking-[0.16em]"
        style={{ color: Gold }}
    >
        {children}
    </div>
);

export const Big = ({ children, size = 'text-[22cqw]', style }) => (
    <div
        className={`font-['Cinzel'] font-semibold leading-[1.05] ${size}`}
        style={{ color: Ink, ...style }}
    >
        {children}
    </div>
);

// Cinzel's capitals are wide, so long names are made smaller to fit on one line rather than breaking mid-word
const nameSize = (name, max) => ({
    fontSize: `${Math.min(max, 80 / Math.max(name.length, 1))}cqw`
});

export const Body = ({ children, className = '' }) => (
    <p
        className={`m-0 font-['EB_Garamond'] text-[5.6cqw] leading-[1.3] ${className}`}
        style={{ color: Ink }}
    >
        {children}
    </p>
);

// A note in the margin, in the page's accent colour
export const Note = ({ children, accent }) => (
    <span
        className="inline-block w-fit rounded-full border-[0.35cqw] px-[3.2cqw] py-[1cqw] font-['EB_Garamond'] text-[4.2cqw] italic leading-[1.2]"
        style={{ borderColor: accent, color: accent }}
    >
        {children}
    </span>
);

export const Fact = ({ label, value, marker }) => (
    <div className='flex min-w-0 flex-col gap-[0.5cqw]'>
        <span
            className="flex items-center gap-[1.5cqw] font-['Cinzel'] text-[3.2cqw] font-bold uppercase leading-[1.2] tracking-wider"
            style={{ color: Gold }}
        >
            {marker && (
                <span
                    className='inline-block h-[2.4cqw] w-[2.4cqw] rotate-45'
                    style={{ background: marker }}
                />
            )}
            {label}
        </span>
        <span
            className="break-words font-['EB_Garamond'] text-[7.5cqw] font-semibold leading-tight"
            style={{ color: Ink }}
        >
            {value}
        </span>
    </div>
);

export const Rule = ({ accent = Gold }) => (
    <div className='flex items-center gap-[2cqw]' aria-hidden='true'>
        <span className='h-[0.3cqw] flex-1' style={{ background: `${accent}88` }} />
        <span className='h-[2cqw] w-[2cqw] rotate-45' style={{ background: accent }} />
        <span className='h-[0.3cqw] flex-1' style={{ background: `${accent}88` }} />
    </div>
);

// Pages are left out when there isn't enough data for them. `detailed` pages use in-game stats, which only exist for
// part of the year
const useWrappedCards = (wrapped, username) => {
    const {
        number,
        plural,
        record,
        factionName,
        factionImage,
        pairingName,
        cardTitle,
        agendaCode,
        formatDay
    } = useStatsFormat();
    const rank = (top, text, accent) =>
        top && top <= MaxRankShown ? (
            <Note accent={accent}>{text.replace('{rank}', top)}</Note>
        ) : null;

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

    const hours = Math.round(wrapped.seconds / 3600);
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
    const factionAccent = faction ? FactionColours[faction.faction] || Gold : Gold;
    const pairing = wrapped.topPairing;
    const mvp = detailed?.mvp;
    const plot = detailed?.favouritePlot;

    const story = [];

    story.push({
        key: 'cover',
        cover: true,
        accent: Gold,
        content: (
            <div className='flex h-full flex-col items-center justify-center gap-[5cqw] text-center'>
                <div
                    className="font-['Cinzel'] text-[5cqw] font-bold uppercase tracking-[0.3em]"
                    style={{ color: Gold }}
                >
                    The
                </div>
                <div
                    className="font-['Cinzel'] text-[15cqw] font-bold uppercase leading-[0.95]"
                    style={{ color: Gold }}
                >
                    White
                    <br />
                    Book
                </div>
                <Rule />
                <Big size='text-[20cqw]' style={{ color: Gold }}>
                    {wrapped.year}
                </Big>
                <Body className='italic'>
                    Being a true account of the deeds of
                    <br />
                    <span className="font-['Cinzel'] not-italic font-semibold">{username}</span>
                </Body>
                <Body className='text-[4.4cqw] italic opacity-80'>Recorded {period}</Body>
            </div>
        )
    });

    story.push({
        key: 'games',
        accent: '#4c2a85',
        content: (
            <div className='flex h-full flex-col justify-center gap-[4cqw]'>
                <Kicker>Of battles fought</Kicker>
                <Big>{number(wrapped.games)}</Big>
                <Body>
                    In the year {wrapped.year}, {username} sat down at the table{' '}
                    {plural(wrapped.games, 'once', '{count} times')}, for some{' '}
                    {plural(hours, 'hour', '{count} hours')} in all.
                </Body>
                {rank(wrapped.ranks?.games, 'Among the top {rank}% for battles fought', '#4c2a85')}
                <div className='mt-[3cqw] flex h-[26cqw] items-end gap-[1.2cqw]'>
                    {wrapped.byMonth.map((count, month) => (
                        <div key={month} className='flex h-full flex-1 flex-col justify-end'>
                            <div
                                className='rounded-t-[0.6cqw]'
                                style={{
                                    height: count > 0 ? `${(100 * count) / maxMonth}%` : 0,
                                    background: month === busiestMonth ? '#4c2a85' : `${Ink}55`
                                }}
                            />
                            <div
                                className="pt-[1cqw] text-center font-['Cinzel'] text-[3cqw] leading-[1.2]"
                                style={{ color: Gold }}
                            >
                                {monthName(month, 'narrow')}
                            </div>
                        </div>
                    ))}
                </div>
                <Body className='text-[4.8cqw] italic'>
                    {monthName(busiestMonth)} saw the most fighting.
                </Body>
            </div>
        )
    });

    story.push({
        key: 'record',
        accent: '#0b6b3c',
        content: (
            <div className='flex h-full flex-col justify-center gap-[4cqw]'>
                <Kicker>Of victories</Kicker>
                <Big>{number(wrapped.wins)}</Big>
                <Body>
                    {plural(wrapped.wins, 'victory', 'victories')}, and{' '}
                    {plural(wrapped.losses, 'one defeat', '{count} defeats')}.
                </Body>
                {wrapped.games >= MinGamesForRates && (
                    <>
                        <Rule accent='#0b6b3c' />
                        <Big size='text-[11cqw]'>{winRate}% of battles won</Big>
                    </>
                )}
                <div className='flex flex-col gap-[2cqw]'>
                    {rank(wrapped.ranks?.wins, 'Among the top {rank}% for victories', '#0b6b3c')}
                    {rank(
                        wrapped.ranks?.winRate,
                        'Among the top {rank}% for battles won',
                        '#0b6b3c'
                    )}
                </div>
            </div>
        )
    });

    if (wrapped.dominantWins > 0 || wrapped.longestWinStreak > 1 || wrapped.fastestWin) {
        story.push({
            key: 'deeds',
            accent: '#8f0105',
            content: (
                <div className='flex h-full flex-col justify-center gap-[5cqw]'>
                    <Kicker>Of great deeds</Kicker>
                    {wrapped.dominantWins > 0 && (
                        <div className='flex flex-col gap-[2cqw]'>
                            <Big size='text-[20cqw]'>{number(wrapped.dominantWins)}</Big>
                            <Body>
                                {plural(
                                    wrapped.dominantWins,
                                    'dominant victory, the foe left far behind on power.',
                                    'dominant victories, the foe left far behind on power.'
                                )}
                            </Body>
                            {rank(
                                wrapped.ranks?.dominantWins,
                                'Among the top {rank}% for dominant victories',
                                '#8f0105'
                            )}
                        </div>
                    )}
                    <Rule accent='#8f0105' />
                    <div className='grid grid-cols-2 gap-[4cqw]'>
                        {wrapped.longestWinStreak > 1 && (
                            <Fact
                                label='Unbroken'
                                value={`${wrapped.longestWinStreak} wins in a row`}
                            />
                        )}
                        {wrapped.fastestWin && (
                            <Fact
                                label='Swiftest victory'
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
            accent: factionAccent,
            content: (
                <div className='flex h-full flex-col items-center justify-center gap-[4cqw] text-center'>
                    <Kicker>Sworn to</Kicker>
                    {factionImage(faction.faction) && (
                        <img
                            alt=''
                            className='w-[42cqw] rounded-[2cqw] shadow-[0_2cqw_5cqw_rgba(42,31,20,0.45)]'
                            style={{ border: `0.8cqw solid ${factionAccent}` }}
                            src={factionImage(faction.faction)}
                        />
                    )}
                    <Big size='text-[12cqw]' style={{ color: factionAccent }}>
                        {factionName(faction.faction)}
                    </Big>
                    <Body>
                        {plural(faction.games, 'One battle', '{count} battles')} under its banner,{' '}
                        {plural(faction.wins, 'one', '{count}')} of them won.
                    </Body>
                    {wrapped.site?.topFaction === faction.faction && (
                        <Note accent={factionAccent}>
                            The most played faction in the realm, too
                        </Note>
                    )}
                </div>
            )
        });
    }

    if (pairing && pairing.agendas.length > 0) {
        const accent = FactionColours[pairing.faction] || Gold;
        story.push({
            key: 'deck',
            accent,
            content: (
                <div className='flex h-full flex-col justify-center gap-[5cqw]'>
                    <Kicker>Deck of the year</Kicker>
                    <div className='flex items-end justify-center gap-[3cqw]'>
                        {[
                            factionImage(pairing.faction),
                            ...pairing.agendas
                                .map(agendaCode)
                                .filter(Boolean)
                                .map((code) => `/img/cards/${code}.png`)
                        ]
                            .filter(Boolean)
                            .map((image) => (
                                <img
                                    key={image}
                                    alt=''
                                    className='min-w-0 flex-1 rounded-[2cqw] shadow-[0_2cqw_5cqw_rgba(42,31,20,0.45)]'
                                    style={{
                                        border: `0.7cqw solid ${accent}`,
                                        maxWidth: '36cqw'
                                    }}
                                    src={image}
                                />
                            ))}
                    </div>
                    <Big size='text-[8cqw] text-center'>
                        {factionName(pairing.faction)}
                        <br />
                        <span style={{ color: accent }}>{pairingName(pairing)}</span>
                    </Big>
                    <Rule accent={accent} />
                    <div className='grid grid-cols-2 gap-[3cqw]'>
                        <Fact label='Battles' value={number(pairing.games)} />
                        <Fact label='Won and lost' value={record(pairing.wins, pairing.games)} />
                    </div>
                    {wrapped.pairingCount > 1 && (
                        <Body className='text-[4.8cqw] italic'>
                            Chosen above{' '}
                            {plural(wrapped.pairingCount - 1, 'one other', '{count} others')} this
                            year.
                        </Body>
                    )}
                </div>
            )
        });
    }

    if (mvp) {
        story.push({
            key: 'mvp',
            accent: Gold,
            detailed: true,
            content: (
                <div className='flex h-full flex-col items-center justify-center gap-[4cqw] text-center'>
                    <Kicker>Most valiant</Kicker>
                    <img
                        alt={cardTitle(mvp.code)}
                        className='w-[54cqw] rounded-[3cqw] shadow-[0_3cqw_8cqw_rgba(42,31,20,0.5)]'
                        style={{ border: `1cqw solid ${Gold}` }}
                        src={`/img/cards/${mvp.code}.png`}
                    />
                    <Big size='text-[9cqw]'>{cardTitle(mvp.code)}</Big>
                    <Body>
                        Rode to the attack {plural(mvp.attacked, 'once', '{count} times')} and stood
                        in defence {plural(mvp.defended, 'once', '{count} times')}.
                    </Body>
                </div>
            )
        });
    }

    if (detailed) {
        story.push({
            key: 'power',
            accent: ChallengeColours.power,
            detailed: true,
            content: (
                <div className='flex h-full flex-col justify-center gap-[5cqw]'>
                    <Kicker>Of power and gold</Kicker>
                    <Big>{number(detailed.powerGained)}</Big>
                    <Body>
                        power claimed, {number(detailed.powerFromRenown)} of it through renown, and{' '}
                        {number(detailed.goldGained)} gold gathered.
                    </Body>
                    <Rule accent={ChallengeColours.power} />
                    <div className='grid grid-cols-3 gap-[3cqw]'>
                        <Fact
                            label='Military'
                            marker={ChallengeColours.military}
                            value={number(detailed.challengesWon.military)}
                        />
                        <Fact
                            label='Intrigue'
                            marker={ChallengeColours.intrigue}
                            value={number(detailed.challengesWon.intrigue)}
                        />
                        <Fact
                            label='Power'
                            marker={ChallengeColours.power}
                            value={number(detailed.challengesWon.power)}
                        />
                    </div>
                    <Body className='text-[4.6cqw] italic'>Challenges won.</Body>
                    {plot && (
                        <Body className='text-[4.8cqw]'>
                            The plot most often revealed was{' '}
                            <span className='font-semibold'>{cardTitle(plot.code)}</span>,{' '}
                            {plural(plot.revealed, 'once', '{count} times')}.
                        </Body>
                    )}
                </div>
            )
        });
    }

    if (wrapped.rival) {
        story.push({
            key: 'rivals',
            accent: '#56606c',
            content: (
                <div className='flex h-full flex-col justify-center gap-[5cqw]'>
                    <Kicker>Rival</Kicker>
                    <div className='flex flex-col gap-[2cqw]'>
                        <Big size='whitespace-nowrap' style={nameSize(wrapped.rival.name, 12)}>
                            {wrapped.rival.name}
                        </Big>
                        <Body>
                            Met on the field {plural(wrapped.rival.games, 'once', '{count} times')}.{' '}
                            {username} prevailed{' '}
                            {plural(wrapped.rival.wins, 'once', '{count} times')}.
                        </Body>
                    </div>
                    {wrapped.nemesis && wrapped.nemesis.name !== wrapped.rival.name && (
                        <>
                            <Rule accent='#56606c' />
                            <div className='flex flex-col gap-[2cqw]'>
                                <Kicker>Nemesis</Kicker>
                                <Big
                                    size='whitespace-nowrap'
                                    style={nameSize(wrapped.nemesis.name, 10)}
                                >
                                    {wrapped.nemesis.name}
                                </Big>
                                <Body>
                                    Bested {username}{' '}
                                    {plural(wrapped.nemesis.lossesTo, 'once', '{count} times')}.
                                </Body>
                            </div>
                        </>
                    )}
                    <Body className='text-[4.8cqw] italic'>
                        {plural(
                            wrapped.opponentCount,
                            'One foe was faced this year.',
                            '{count} different foes were faced this year.'
                        )}
                    </Body>
                </div>
            )
        });
    }

    story.push({
        key: 'time',
        accent: timeOfDay.accent,
        content: (
            <div className='flex h-full flex-col justify-center gap-[5cqw]'>
                <Kicker>When battle was joined</Kicker>
                <Big size='text-[14cqw]' style={{ color: timeOfDay.accent }}>
                    {timeOfDay.name}
                </Big>
                <Body>{timeOfDay.description}</Body>
                <Rule accent={timeOfDay.accent} />
                <div className='grid grid-cols-2 gap-[4cqw]'>
                    <Fact label='Busiest hour' value={formatHour(peakHour)} />
                    <Fact label='Busiest month' value={monthName(busiestMonth)} />
                </div>
            </div>
        )
    });

    story.push({
        key: 'summary',
        accent: Gold,
        content: (
            <div className='flex h-full flex-col justify-center gap-[4.5cqw]'>
                <div className='flex flex-col gap-[1.5cqw]'>
                    <Kicker>The White Book · {wrapped.year}</Kicker>
                    <Big size='whitespace-nowrap' style={nameSize(username, 11)}>
                        {username}
                    </Big>
                </div>
                <Rule />
                <div className='grid grid-cols-2 gap-x-[4cqw] gap-y-[4.5cqw]'>
                    <Fact label='Battles' value={number(wrapped.games)} />
                    <Fact label='Won and lost' value={record(wrapped.wins, wrapped.games)} />
                    <Fact label='Dominant' value={number(wrapped.dominantWins)} />
                    <Fact label='Hours played' value={number(hours)} />
                    {faction && <Fact label='Sworn to' value={factionName(faction.faction)} />}
                    {mvp && <Fact label='Most valiant' value={cardTitle(mvp.code)} />}
                </div>
                {pairing && pairing.agendas.length > 0 && (
                    <Fact label='Deck of the year' value={pairingName(pairing)} />
                )}
                <Body className='text-[4.8cqw] italic'>Here ends the page of {username}.</Body>
            </div>
        )
    });

    return story.map((card) => ({ ...card, note: card.detailed ? detailedNote : null }));
};

export default useWrappedCards;
