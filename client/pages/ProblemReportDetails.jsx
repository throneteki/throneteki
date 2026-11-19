import React, { useMemo, useState } from 'react';
import moment from 'moment';
import classNames from 'classnames';
import { Button, Tabs } from '@heroui/react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCopy, faDownload, faSearch } from '@fortawesome/free-solid-svg-icons';
import { toast } from 'react-toastify';

import Field from '../Components/Site/Field';
import Notice from '../Components/Site/Notice';
import Tag from '../Components/Site/Tag';
import UserAvatar from '../Components/Site/UserAvatar';
import Messages from '../Components/GameBoard/Messages';
import CardHoverable from '../Components/Images/CardHoverable';
import { Constants } from '../constants';

const formatPart = (part) => {
    if (Array.isArray(part)) {
        return part.map(formatPart).join('');
    }

    if (part && typeof part === 'object') {
        if (part.alert) {
            return formatPart(part.alert.message);
        }

        return Object.values(part).some((value) => typeof value === 'object')
            ? Object.values(part).map(formatPart).join('')
            : part.name || part.label || '';
    }

    return part === undefined || part === null ? '' : String(part);
};

const isChat = (message) =>
    Object.values(message.message || {}).some(
        (fragment) => fragment?.name && fragment.argType === 'player'
    );

const copy = (text, label) => {
    navigator.clipboard
        ?.writeText(text)
        .then(() => toast.success(`${label} copied`))
        .catch(() => toast.error(`Could not copy the ${label.toLowerCase()}`));
};

const hasValue = (value) => value !== null && value !== undefined;

const Section = ({ title, aside, tone, children }) => (
    <section
        className={classNames(
            'border px-4 py-3',
            tone === 'warning'
                ? 'border-warning/40 bg-warning/[0.06]'
                : 'border-gold-hair bg-black/20'
        )}
    >
        {title && (
            <header className='mb-2 flex items-baseline justify-between gap-2'>
                <h4
                    className={classNames(
                        'text-sm font-semibold',
                        tone === 'warning' ? 'text-warning' : 'text-ink'
                    )}
                >
                    {title}
                </h4>
                {aside}
            </header>
        )}
        {children}
    </section>
);

const CardName = ({ card }) =>
    card ? (
        <CardHoverable code={card.code}>
            <span className='cursor-pointer text-gold hover:text-ink'>{card.name}</span>
        </CardHoverable>
    ) : (
        <span className='text-ink-faint'>unknown card</span>
    );

const StatIcon = ({ stat, value, label }) => (
    <span className='flex items-center gap-1' title={label}>
        <img src={Constants.StatIconImagePaths[stat]} alt={label} className='size-5' />
        <span className='text-ink'>{value}</span>
    </span>
);

const PromptCallout = ({ prompt, cardFor }) => {
    if (!prompt) {
        return <p className='text-sm text-ink-faint'>Prompt not recorded (older report).</p>;
    }

    const title = [prompt.promptTitle, prompt.menuTitle].filter(Boolean).join(': ');
    const isWaiting = !prompt.selectCard && (!prompt.buttons || prompt.buttons.length === 0);

    return (
        <div
            className={classNames(
                'flex flex-col gap-2 border px-3 py-2',
                isWaiting ? 'border-gold-hair' : 'border-gold-line bg-gold/[0.06]'
            )}
        >
            <span className={classNames('text-sm', isWaiting ? 'text-ink-faint' : 'text-ink')}>
                <span className='me-2 text-xs text-ink-faint'>
                    {isWaiting ? 'Waiting' : 'Prompted'}
                </span>
                {title || 'No prompt'}
            </span>
            {prompt.buttons?.length > 0 && (
                <div className='flex flex-wrap gap-1'>
                    {prompt.buttons.map((button, index) => (
                        <span
                            key={index}
                            className={classNames(
                                'border border-gold-hair bg-white/[0.04] px-2 py-0.5 text-xs text-ink-dim',
                                button.disabled && 'line-through opacity-50'
                            )}
                        >
                            {button.text}
                        </span>
                    ))}
                </div>
            )}
            {prompt.selectableCards?.length > 0 && (
                <p className='text-sm'>
                    <span className='text-ink-faint'>Can select </span>
                    {prompt.selectableCards.map((id, index) => (
                        <span key={id}>
                            {index > 0 && ', '}
                            <CardName card={cardFor(id)} />
                        </span>
                    ))}
                </p>
            )}
        </div>
    );
};

const PlayerCard = ({ player, cardFor, isReporter }) => {
    const settings = player.settings;
    const stops = settings
        ? Object.entries(settings.promptedActionWindows || {})
              .filter(([, enabled]) => enabled)
              .map(([name]) => name)
        : [];

    return (
        <Section>
            <div className='flex flex-col gap-3'>
                <div className='flex items-center gap-3'>
                    {Constants.FactionsImagePaths[player.faction] ? (
                        <img
                            src={Constants.FactionsImagePaths[player.faction]}
                            alt={player.faction}
                            className='size-9'
                        />
                    ) : (
                        <UserAvatar username={player.name} size='sm' />
                    )}
                    <div className='flex min-w-0 flex-col'>
                        <span className='truncate text-ink'>{player.name}</span>
                        <span className='flex flex-wrap gap-1'>
                            {isReporter && <Tag tone='warning'>Reporter</Tag>}
                            {player.firstPlayer && <Tag>First player</Tag>}
                            {player.left && <Tag tone='danger'>Left</Tag>}
                            {player.eliminated && <Tag tone='danger'>Eliminated</Tag>}
                        </span>
                    </div>
                    <div className='ms-auto flex gap-3 text-sm'>
                        <StatIcon stat='gold' value={player.gold} label='Gold' />
                        <StatIcon stat='totalPower' value={player.power} label='Power' />
                    </div>
                </div>
                <p className='text-sm'>
                    <span className='text-ink-faint'>Plot </span>
                    <CardName card={cardFor(player.activePlot)} />
                </p>
                <PromptCallout prompt={player.prompt} cardFor={cardFor} />
                {settings && (
                    <div className='flex flex-wrap gap-1'>
                        <Tag>Stops: {stops.join(', ') || 'none'}</Tag>
                        {settings.hideInterrupts && <Tag>Hides interrupts</Tag>}
                        {settings.hideReactions && <Tag>Hides reactions</Tag>}
                        {settings.responsesPausedForPhase && (
                            <Tag tone='warning'>Response waits paused this phase</Tag>
                        )}
                    </div>
                )}
            </div>
        </Section>
    );
};

const GameLog = ({ messages }) => {
    const [search, setSearch] = useState('');
    const [chatOnly, setChatOnly] = useState(false);

    const filtered = useMemo(() => {
        const term = search.trim().toLowerCase();

        return messages.filter(
            (message) =>
                (!chatOnly || isChat(message)) &&
                (!term || formatPart(message.message).toLowerCase().includes(term))
        );
    }, [messages, search, chatOnly]);

    return (
        <div className='flex flex-col gap-3'>
            <div className='flex flex-wrap items-center gap-2'>
                <Field
                    aria-label='Search the log'
                    placeholder='Search the log'
                    startContent={<FontAwesomeIcon icon={faSearch} />}
                    value={search}
                    onValueChange={setSearch}
                    className='w-full sm:w-72'
                />
                <button
                    type='button'
                    aria-pressed={chatOnly}
                    onClick={() => setChatOnly(!chatOnly)}
                    className={
                        chatOnly
                            ? 'rounded-full border border-gold-line bg-gold/10 px-3 py-0.5 text-sm text-ink'
                            : 'rounded-full border border-white/10 px-3 py-0.5 text-sm text-ink-faint hover:text-ink-dim'
                    }
                >
                    Chat only
                </button>
            </div>
            {filtered.length === 0 && <p className='text-sm text-ink-faint'>No messages match.</p>}
            <ol className='flex flex-col gap-1'>
                {filtered.map((message, index) => (
                    <li key={index} className='flex items-start gap-3'>
                        <span className='w-14 shrink-0 pt-0.5 font-mono text-xs text-ink-faint'>
                            {message.date ? moment(message.date).local().format('HH:mm:ss') : ''}
                        </span>
                        <div className='min-w-0 flex-1 text-sm'>
                            <Messages messages={[message]} />
                        </div>
                    </li>
                ))}
            </ol>
        </div>
    );
};

const AbilityLog = ({ entries, cardFor }) => (
    <ol className='border-t border-gold-hair'>
        {[...entries].reverse().map((entry, index) => (
            <li
                key={index}
                className='flex items-start gap-3 border-b border-gold-hair py-2 text-sm'
            >
                <span className='w-14 shrink-0 pt-0.5 font-mono text-xs text-ink-faint'>
                    {entry.at ? moment(entry.at).local().format('HH:mm:ss') : ''}
                </span>
                <div className='min-w-0 flex-1'>
                    <span className='text-ink'>{entry.player || 'Game'}</span>{' '}
                    <span className='text-ink-faint'>{entry.type}</span>{' '}
                    <CardName card={cardFor(entry.source?.id) || entry.source} />
                    {entry.targets?.length > 0 && (
                        <>
                            <span className='text-ink-faint'> on </span>
                            {entry.targets.map((id, i) => (
                                <span key={id}>
                                    {i > 0 && ', '}
                                    <CardName card={cardFor(id)} />
                                </span>
                            ))}
                        </>
                    )}
                    {entry.results?.length > 0 && (
                        <div className='mt-0.5 flex flex-wrap gap-1'>
                            {entry.results.map((result, i) => (
                                <Tag key={i}>
                                    {[
                                        result.event,
                                        result.card?.name,
                                        result.player,
                                        hasValue(result.amount) && result.amount
                                    ]
                                        .filter((part) => hasValue(part) && part !== false)
                                        .join(' · ')}
                                </Tag>
                            ))}
                        </div>
                    )}
                </div>
            </li>
        ))}
    </ol>
);

const ProblemReportDetails = ({ report, onDownload, onDelete }) => {
    const cardsById = useMemo(
        () => new Map((report.cards || []).map((card) => [card.id, card])),
        [report]
    );
    const cardFor = (id) => cardsById.get(id);
    const game = report.game || {};
    const challenge = game.currentChallenge;
    const created = moment(report.createdAt).local();
    const cardNames = (ids) =>
        (ids || []).map((id, index) => (
            <span key={id}>
                {index > 0 && ', '}
                <CardName card={cardFor(id)} />
            </span>
        ));

    const players = report.players || [];
    const messages = report.messages || [];
    const abilityLog = report.abilityLog || [];
    const captureErrors = report.captureErrors || [];
    const scenarioCommand = `SCENARIO='file:${report.id}.json' SCENARIO_USERS='${players.map((_, index) => `account${index + 1}`).join(',')}' node server/gamenode`;

    return (
        <div className='flex min-h-0 flex-1 flex-col gap-4'>
            <header className='flex shrink-0 flex-col gap-3'>
                <p
                    className={classNames(
                        'text-lg leading-snug [overflow-wrap:anywhere]',
                        report.description ? 'text-ink' : 'text-ink-faint'
                    )}
                >
                    {report.description ||
                        (report.source === 'cancel-prompt'
                            ? 'Sent by /cancel-prompt, without a description.'
                            : 'No description given.')}
                </p>
                <div className='flex flex-wrap items-center gap-x-3 gap-y-2 text-sm'>
                    <span className='flex items-center gap-2'>
                        <UserAvatar username={report.reporter} size='sm' />
                        <span className='text-ink'>{report.reporter}</span>
                    </span>
                    <span className='text-ink-faint' title={created.format('D MMM YYYY, H:mm:ss')}>
                        {created.format('D MMM, H:mm')} ({created.fromNow()})
                    </span>
                </div>
                <div className='flex flex-wrap gap-1'>
                    {report.source === 'cancel-prompt' && <Tag tone='warning'>/cancel-prompt</Tag>}
                    {hasValue(game.round) && <Tag>Round {game.round}</Tag>}
                    {game.phase && (
                        <Tag>
                            {game.phase[0].toUpperCase()}
                            {game.phase.slice(1)} phase
                        </Tag>
                    )}
                    <Tag tone={game.manualMode ? 'danger' : undefined}>
                        Manual mode {game.manualMode ? 'on' : 'off'}
                    </Tag>
                    {game.actionWindow && (
                        <Tag>
                            {game.actionWindow.name} window: {game.actionWindow.currentPlayer}
                        </Tag>
                    )}
                    {game.challengeTurn && (
                        <Tag>
                            Challenge turn: {game.challengeTurn.activePlayer || 'none'}
                            {game.challengeTurn.finishedPlayers.length > 0 &&
                                ` (finished: ${game.challengeTurn.finishedPlayers.join(', ')})`}
                        </Tag>
                    )}
                </div>
                <div className='flex flex-wrap items-center gap-2'>
                    <Button size='sm' variant='tertiary' onPress={onDownload}>
                        <FontAwesomeIcon icon={faDownload} />
                        Download JSON
                    </Button>
                    <Button
                        size='sm'
                        variant='tertiary'
                        onPress={() => copy(scenarioCommand, 'Scenario command')}
                    >
                        <FontAwesomeIcon icon={faCopy} />
                        Copy scenario command
                    </Button>
                    <Button
                        size='sm'
                        variant='ghost'
                        className='text-danger sm:ms-auto'
                        onPress={onDelete}
                    >
                        Delete
                    </Button>
                </div>
            </header>

            <Tabs className='flex min-h-0 flex-1 flex-col'>
                <Tabs.ListContainer className='shrink-0'>
                    <Tabs.List aria-label='Report details'>
                        <Tabs.Tab id='overview'>
                            Game state
                            <Tabs.Indicator />
                        </Tabs.Tab>
                        <Tabs.Tab id='log'>
                            {`Game log (${messages.length})`}
                            <Tabs.Indicator />
                        </Tabs.Tab>
                        {abilityLog.length > 0 && (
                            <Tabs.Tab id='abilities'>
                                {`Abilities (${abilityLog.length})`}
                                <Tabs.Indicator />
                            </Tabs.Tab>
                        )}
                    </Tabs.List>
                </Tabs.ListContainer>
                <Tabs.Panel id='overview' className='min-h-0 flex-1 overflow-y-auto px-0 pt-3'>
                    <div className='flex flex-col gap-3'>
                        {captureErrors.length > 0 && (
                            <Notice kind='warning' isBoxed>
                                Some of the game state couldn&apos;t be recorded:{' '}
                                {captureErrors
                                    .map((error) => `${error.part} (${error.message})`)
                                    .join('; ')}
                            </Notice>
                        )}

                        {report.abilityStack?.length > 0 && (
                            <Section title='Resolving when the report was sent' tone='warning'>
                                <ul className='flex flex-col gap-1 text-sm'>
                                    {report.abilityStack.map((context, index) => (
                                        <li key={index}>
                                            <span className='text-ink'>{context.player}</span>{' '}
                                            <CardName
                                                card={cardFor(context.source?.id) || context.source}
                                            />
                                            {context.ability && ` (${context.ability})`}
                                            {context.event && (
                                                <span className='text-ink-faint'>
                                                    {' '}
                                                    triggered by {context.event}
                                                </span>
                                            )}
                                            {context.targets?.length > 0 && (
                                                <> targeting {cardNames(context.targets)}</>
                                            )}
                                            <Tag className='ms-2'>{context.stage}</Tag>
                                        </li>
                                    ))}
                                </ul>
                            </Section>
                        )}

                        {challenge && (
                            <Section
                                title={`${challenge.attackingPlayer}'s ${challenge.currentType || challenge.type} challenge against ${challenge.defendingPlayer || 'nobody yet'}`}
                                aside={<Tag>{challenge.stage}</Tag>}
                            >
                                <dl className='grid grid-cols-[auto_1fr] gap-x-4 gap-y-1 text-sm'>
                                    <dt className='text-ink-faint'>Attackers</dt>
                                    <dd>
                                        {challenge.attackers?.length > 0
                                            ? cardNames(challenge.attackers)
                                            : 'none'}
                                        {hasValue(challenge.attackerStrength) && (
                                            <span className='text-ink-faint'>
                                                {' '}
                                                STR {challenge.attackerStrength}
                                            </span>
                                        )}
                                    </dd>
                                    <dt className='text-ink-faint'>Defenders</dt>
                                    <dd>
                                        {challenge.defenders?.length > 0
                                            ? cardNames(challenge.defenders)
                                            : 'none'}
                                        {hasValue(challenge.defenderStrength) && (
                                            <span className='text-ink-faint'>
                                                {' '}
                                                STR {challenge.defenderStrength}
                                            </span>
                                        )}
                                    </dd>
                                </dl>
                            </Section>
                        )}

                        <div
                            className={classNames(
                                'grid grid-cols-1 gap-3',
                                players.length > 1 && 'xl:grid-cols-2'
                            )}
                        >
                            {players.map((player) => (
                                <PlayerCard
                                    key={player.name}
                                    player={player}
                                    cardFor={cardFor}
                                    isReporter={player.name === report.reporter}
                                />
                            ))}
                        </div>

                        <p className='flex flex-wrap items-center gap-x-2 text-xs text-ink-faint'>
                            <span>{game.name}</span>
                            <span>{[game.format, game.variant].filter(Boolean).join(', ')}</span>
                            <span>{report.serverVersion || 'Unknown version'}</span>
                            <span>Report format {report.schemaVersion}</span>
                            <button
                                type='button'
                                className='font-mono hover:text-ink-dim'
                                title='Copy report ID'
                                onClick={() => copy(report.id, 'Report ID')}
                            >
                                {report.id}
                            </button>
                        </p>
                    </div>
                </Tabs.Panel>
                <Tabs.Panel id='log' className='min-h-0 flex-1 overflow-y-auto px-0 pt-3'>
                    <GameLog messages={messages} />
                </Tabs.Panel>
                {abilityLog.length > 0 && (
                    <Tabs.Panel id='abilities' className='min-h-0 flex-1 overflow-y-auto px-0 pt-3'>
                        <AbilityLog entries={abilityLog} cardFor={cardFor} />
                    </Tabs.Panel>
                )}
            </Tabs>
        </div>
    );
};

export default ProblemReportDetails;
