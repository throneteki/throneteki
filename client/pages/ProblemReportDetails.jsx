import React, { useMemo, useState } from 'react';
import moment from 'moment';
import classNames from 'classnames';
import {
    Avatar,
    Button,
    Card,
    CardBody,
    CardHeader,
    Chip,
    Input,
    Switch,
    Tab,
    Tabs
} from '@heroui/react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
    faBolt,
    faCopy,
    faDownload,
    faTrashAlt,
    faHandPointer,
    faSearch
} from '@fortawesome/free-solid-svg-icons';
import { toast } from 'react-toastify';

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

const SectionCard = ({ title, icon, actions, children, className }) => (
    <Card className={classNames('bg-zinc-900 border-1 border-default-200 shadow-none', className)}>
        {title && (
            <CardHeader className='flex justify-between gap-2 pb-0'>
                <div className='flex items-center gap-2 font-bold'>
                    {icon && <FontAwesomeIcon icon={icon} className='text-primary' />}
                    {title}
                </div>
                {actions}
            </CardHeader>
        )}
        <CardBody>{children}</CardBody>
    </Card>
);

const CardName = ({ card }) =>
    card ? (
        <CardHoverable code={card.code}>
            <span className='cursor-pointer text-secondary hover:text-info'>{card.name}</span>
        </CardHoverable>
    ) : (
        <span className='text-default-500'>-</span>
    );

const StatIcon = ({ stat, value, label }) => (
    <span className='flex items-center gap-1' title={label}>
        <img src={Constants.StatIconImagePaths[stat]} alt={label} className='w-5 h-5' />
        <span className='font-bold'>{value}</span>
    </span>
);

const PromptCallout = ({ prompt, cardFor }) => {
    if (!prompt) {
        return <p className='text-small text-default-500'>Prompt not recorded (older report)</p>;
    }

    const title = [prompt.promptTitle, prompt.menuTitle].filter(Boolean).join(': ');
    const isWaiting = !prompt.selectCard && (!prompt.buttons || prompt.buttons.length === 0);

    return (
        <div
            className={classNames('rounded-medium p-2 border-1 flex flex-col gap-2', {
                'border-primary bg-primary/10': !isWaiting,
                'border-default-200 bg-default/20': isWaiting
            })}
        >
            <div className='flex items-center gap-2 text-small'>
                <FontAwesomeIcon
                    icon={faHandPointer}
                    className={isWaiting ? 'text-default-500' : 'text-primary'}
                />
                <span className={isWaiting ? 'text-default-500' : 'font-bold'}>
                    {title || 'No prompt'}
                </span>
            </div>
            {prompt.buttons?.length > 0 && (
                <div className='flex flex-wrap gap-1'>
                    {prompt.buttons.map((button, index) => (
                        <Chip
                            key={index}
                            size='sm'
                            variant='bordered'
                            className={classNames({ 'opacity-50 line-through': button.disabled })}
                        >
                            {button.text}
                        </Chip>
                    ))}
                </div>
            )}
            {prompt.selectableCards?.length > 0 && (
                <div className='text-small'>
                    <span className='text-default-500'>Can select: </span>
                    {prompt.selectableCards.map((id, index) => (
                        <span key={id}>
                            {index > 0 && ', '}
                            <CardName card={cardFor(id)} />
                        </span>
                    ))}
                </div>
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
        <SectionCard>
            <div className='flex flex-col gap-3'>
                <div className='flex items-center gap-3'>
                    {Constants.FactionsImagePaths[player.faction] ? (
                        <img
                            src={Constants.FactionsImagePaths[player.faction]}
                            alt={player.faction}
                            className='w-10 h-10'
                        />
                    ) : (
                        <Avatar src={`/img/avatar/${player.name}.png`} showFallback size='sm' />
                    )}
                    <div className='flex flex-col'>
                        <span className='font-bold text-large'>{player.name}</span>
                        <div className='flex gap-1'>
                            {isReporter && (
                                <Chip size='sm' color='warning' variant='flat'>
                                    Reporter
                                </Chip>
                            )}
                            {player.firstPlayer && (
                                <Chip size='sm' variant='flat'>
                                    First player
                                </Chip>
                            )}
                        </div>
                    </div>
                    <div className='ml-auto flex gap-3'>
                        <StatIcon stat='gold' value={player.gold} label='Gold' />
                        <StatIcon stat='totalPower' value={player.power} label='Power' />
                    </div>
                </div>
                <div className='text-small'>
                    <span className='text-default-500'>Plot: </span>
                    <CardName card={cardFor(player.activePlot)} />
                </div>
                <PromptCallout prompt={player.prompt} cardFor={cardFor} />
                {settings && (
                    <div className='flex flex-wrap gap-1'>
                        <Chip size='sm' variant='flat'>
                            Stops: {stops.join(', ') || 'none'}
                        </Chip>
                        {settings.hideInterrupts && (
                            <Chip size='sm' variant='flat'>
                                Hides interrupts
                            </Chip>
                        )}
                        {settings.hideReactions && (
                            <Chip size='sm' variant='flat'>
                                Hides reactions
                            </Chip>
                        )}
                        {settings.responsesPausedForPhase && (
                            <Chip size='sm' color='warning' variant='flat'>
                                Response waits paused this phase
                            </Chip>
                        )}
                    </div>
                )}
            </div>
        </SectionCard>
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
        <div className='flex flex-col gap-2 h-full min-h-0'>
            <div className='flex items-center gap-2'>
                <Input
                    size='sm'
                    placeholder='Search the log'
                    startContent={<FontAwesomeIcon icon={faSearch} />}
                    value={search}
                    onValueChange={setSearch}
                    isClearable
                    onClear={() => setSearch('')}
                />
                <Switch
                    size='sm'
                    isSelected={chatOnly}
                    onValueChange={setChatOnly}
                    classNames={{ label: 'whitespace-nowrap' }}
                >
                    Chat only
                </Switch>
            </div>
            <div className='flex-1 min-h-0 overflow-y-auto pr-1 flex flex-col gap-1'>
                {filtered.length === 0 && (
                    <p className='text-default-500 text-small'>No messages match</p>
                )}
                {filtered.map((message, index) => (
                    <div key={index} className='flex gap-2 items-start'>
                        <span className='text-tiny text-default-500 font-mono pt-0.5 shrink-0 w-14'>
                            {message.date ? moment(message.date).local().format('HH:mm:ss') : ''}
                        </span>
                        <div className='min-w-0 flex-1'>
                            <Messages messages={[message]} />
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

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

    return (
        <div className='flex flex-col gap-3 h-full min-h-0'>
            <div className='flex flex-col gap-3 shrink-0'>
                <div className='flex flex-wrap items-center justify-between gap-2'>
                    <div className='flex items-center gap-1 text-small text-default-500'>
                        <code>{report.id}</code>
                        <Button
                            size='sm'
                            variant='light'
                            isIconOnly
                            aria-label='Copy report ID'
                            onPress={() => copy(report.id, 'Report ID')}
                        >
                            <FontAwesomeIcon icon={faCopy} />
                        </Button>
                    </div>
                    <div className='flex gap-2'>
                        <Button
                            size='sm'
                            variant='flat'
                            onPress={() =>
                                copy(
                                    `SCENARIO='file:${report.id}.json' SCENARIO_USERS='${players.map((_, index) => `account${index + 1}`).join(',')}' node server/gamenode`,
                                    'Scenario command'
                                )
                            }
                        >
                            Copy scenario command
                        </Button>
                        <Button
                            size='sm'
                            color='primary'
                            startContent={<FontAwesomeIcon icon={faDownload} />}
                            onPress={onDownload}
                        >
                            JSON
                        </Button>
                        <Button
                            size='sm'
                            color='danger'
                            variant='flat'
                            isIconOnly
                            aria-label='Delete report'
                            onPress={onDelete}
                        >
                            <FontAwesomeIcon icon={faTrashAlt} />
                        </Button>
                    </div>
                </div>

                <blockquote
                    className={classNames('border-l-4 pl-4 py-1 text-large', {
                        'border-primary': report.description,
                        'border-default-300 text-default-500 italic': !report.description
                    })}
                >
                    {report.description || 'No description given'}
                </blockquote>

                <div className='flex flex-wrap items-center gap-2 text-small'>
                    <Avatar
                        src={`/img/avatar/${report.reporter}.png`}
                        showFallback
                        className='w-6 h-6 text-tiny'
                    />
                    <span className='font-bold'>{report.reporter}</span>
                    <span
                        className='text-default-500'
                        title={created.format('YYYY-MM-DD HH:mm:ss')}
                    >
                        {created.format('D MMM, HH:mm')} ({created.fromNow()})
                    </span>
                    <Chip
                        size='sm'
                        variant='flat'
                        color={report.source === 'cancel-prompt' ? 'warning' : 'primary'}
                    >
                        {report.source === 'cancel-prompt' ? '/cancel-prompt' : 'Report Problem'}
                    </Chip>
                    <Chip size='sm' variant='bordered'>
                        Round {game.round}
                    </Chip>
                    <Chip size='sm' variant='bordered' className='capitalize'>
                        {game.phase} phase
                    </Chip>
                    <Chip size='sm' variant='flat' color={game.manualMode ? 'danger' : 'success'}>
                        Manual mode {game.manualMode ? 'on' : 'off'}
                    </Chip>
                    {game.actionWindow && (
                        <Chip size='sm' variant='bordered'>
                            {game.actionWindow.name} window: {game.actionWindow.currentPlayer}
                        </Chip>
                    )}
                    {game.challengeTurn && (
                        <Chip size='sm' variant='bordered'>
                            Challenge turn: {game.challengeTurn.activePlayer || '-'}
                            {game.challengeTurn.finishedPlayers.length > 0 &&
                                ` (finished: ${game.challengeTurn.finishedPlayers.join(', ')})`}
                        </Chip>
                    )}
                </div>
            </div>

            <Tabs
                aria-label='Report details'
                variant='underlined'
                classNames={{ base: 'shrink-0', panel: 'flex-1 min-h-0 overflow-y-auto px-0 pt-2' }}
            >
                <Tab key='overview' title='Overview'>
                    <div className='flex flex-col gap-3'>
                        {report.abilityStack?.length > 0 && (
                            <div className='rounded-large border-1 border-warning bg-warning/10 p-3 flex flex-col gap-1'>
                                <div className='flex items-center gap-2 font-bold text-warning'>
                                    <FontAwesomeIcon icon={faBolt} />
                                    Ability resolving when the report was made
                                </div>
                                {report.abilityStack.map((context, index) => (
                                    <div key={index} className='text-small'>
                                        <span className='font-bold'>{context.player}</span>:{' '}
                                        <CardName
                                            card={cardFor(context.source?.id) || context.source}
                                        />
                                        {context.ability && ` (${context.ability})`}
                                        {context.event && (
                                            <span className='text-default-500'>
                                                {' '}
                                                triggered by {context.event}
                                            </span>
                                        )}
                                        {context.targets?.length > 0 && (
                                            <> targeting {cardNames(context.targets)}</>
                                        )}
                                        <Chip size='sm' variant='flat' className='ml-2'>
                                            {context.stage}
                                        </Chip>
                                    </div>
                                ))}
                            </div>
                        )}

                        {challenge && (
                            <SectionCard title='Challenge in progress'>
                                <div className='flex flex-col gap-1 text-small'>
                                    <div>
                                        <span className='font-bold'>
                                            {challenge.attackingPlayer}
                                        </span>{' '}
                                        <span className='capitalize'>
                                            {challenge.currentType || challenge.type}
                                        </span>{' '}
                                        challenge against{' '}
                                        <span className='font-bold'>
                                            {challenge.defendingPlayer || '-'}
                                        </span>
                                        <Chip size='sm' variant='flat' className='ml-2'>
                                            {challenge.stage}
                                        </Chip>
                                    </div>
                                    <div>
                                        <span className='text-default-500'>Attackers: </span>
                                        {challenge.attackers?.length > 0
                                            ? cardNames(challenge.attackers)
                                            : '-'}
                                        {hasStrength(challenge.attackerStrength) &&
                                            ` (STR ${challenge.attackerStrength})`}
                                    </div>
                                    <div>
                                        <span className='text-default-500'>Defenders: </span>
                                        {challenge.defenders?.length > 0
                                            ? cardNames(challenge.defenders)
                                            : '-'}
                                        {hasStrength(challenge.defenderStrength) &&
                                            ` (STR ${challenge.defenderStrength})`}
                                    </div>
                                </div>
                            </SectionCard>
                        )}

                        <div
                            className={classNames('grid grid-cols-1 gap-3', {
                                'xl:grid-cols-2': players.length > 1
                            })}
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

                        <div className='text-tiny text-default-500'>
                            {game.name} · {game.format} · {game.variant} ·{' '}
                            {report.serverVersion || 'unknown version'} · report format{' '}
                            {report.schemaVersion}
                        </div>
                    </div>
                </Tab>
                <Tab key='log' title={`Game log (${messages.length})`}>
                    <GameLog messages={messages} />
                </Tab>
            </Tabs>
        </div>
    );
};

const hasStrength = (value) => value !== null && value !== undefined;

export default ProblemReportDetails;
