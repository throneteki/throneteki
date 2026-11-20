import React, { useLayoutEffect, useRef, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import classNames from 'classnames';
import {
    Button,
    Dropdown,
    DropdownItem,
    DropdownMenu,
    DropdownSection,
    DropdownTrigger
} from '@heroui/react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
    faBan,
    faBars,
    faBug,
    faCheckCircle,
    faCogs,
    faEye,
    faEyeSlash,
    faFlag,
    faKeyboard,
    faRightFromBracket,
    faTimesCircle,
    faUsers,
    faWrench
} from '@fortawesome/free-solid-svg-icons';
import ConfirmDialog from '../../Site/ConfirmDialog';
import ReportProblemModal from '../ReportProblemModal';
import {
    sendCancelProblemReportMessage,
    sendConcedeMessage,
    sendDescribeProblemMessage,
    sendLeaveGameMessage,
    sendReportProblemMessage,
    sendToggleManualModeMessage,
    sendToggleMuteSpectatorsMessage
} from '../../../redux/reducers/game';

const icon = (glyph) => <FontAwesomeIcon icon={glyph} className='w-4' />;
// Room kept for the menu button, when anything is left for it to hold
const menuButtonWidth = 32;
// Which items keep their place in the bar first when not all of them fit
const priority = [
    'settings',
    'leave',
    'manual',
    'concede',
    'report',
    'spectators',
    'mute',
    'shortcuts'
];

// The game's menu, standing in for the navbar that phone layouts hide: connection, spectators (a dot when their
// number changes, until looked at), settings, manual mode, reporting, shortcuts, conceding and leaving.
// room (px): the room in the bar for its items as buttons, with their names (the desktop's bar). As many as fit
// are shown, in the bar's order: who is watching, then the game's tools, then the ways out. What does not fit is in
// the menu, which is only shown when it holds something. With no room (phones) everything is in the menu, and while
// manual mode is on a wrench beside it says so and turns it off.
const GameMenu = ({ isPlaying, onSettingsClick, onShortcutsClick, room = 0 }) => {
    const dispatch = useDispatch();
    const currentGame = useSelector((state) => state.lobby.currentGame);
    const user = useSelector((state) => state.auth.user);
    const [confirmingLeave, setConfirmingLeave] = useState(false);
    const [reporting, setReporting] = useState(false);
    const manualMode = !!currentGame?.manualMode;
    const muted = !!currentGame?.muteSpectators;
    const server = useSelector((state) => state.game);
    const spectators = currentGame?.spectators ?? [];
    const [spectatorsSeen, setSpectatorsSeen] = useState(spectators.length);
    const newSpectators = isPlaying && spectators.length !== spectatorsSeen;
    // A screen with only touch has no keyboard to use shortcuts with; a mouse or trackpad suggests one
    const [hasKeyboard] = useState(
        () => window.matchMedia?.('(any-pointer: fine)').matches ?? true
    );

    const leave = () => {
        const everyone = Object.values({ ...currentGame.players, ...currentGame.spectators });
        if (user && everyone.some((a) => a.name === user.username && !a.canSafelyLeave)) {
            setConfirmingLeave(true);
            return;
        }
        dispatch(sendLeaveGameMessage());
    };

    const spectatorNames =
        spectators.length > 0 ? spectators.map((spectator) => spectator.name).join(', ') : 'None';

    // In the bar's order. Spectators is only a button in the bar; in the menu it is part of the status.
    const items = [
        {
            key: 'spectators',
            label: `Spectators: ${spectators.length}`,
            glyph: faUsers,
            description: spectatorNames,
            tone: newSpectators ? 'text-warning' : undefined,
            run: () => setSpectatorsSeen(spectators.length),
            barOnly: true
        },
        isPlaying && {
            key: 'mute',
            label: muted ? 'Un-mute spectators' : 'Mute spectators',
            glyph: muted ? faEyeSlash : faEye,
            description: muted ? 'Spectators cannot chat' : 'Spectators can chat',
            run: () => dispatch(sendToggleMuteSpectatorsMessage()),
            iconOnly: true
        },
        { key: 'settings', label: 'Settings', glyph: faCogs, run: onSettingsClick },
        hasKeyboard && {
            key: 'shortcuts',
            label: 'Keyboard shortcuts',
            short: 'Shortcuts',
            glyph: faKeyboard,
            run: onShortcutsClick
        },
        isPlaying && {
            key: 'manual',
            label: manualMode ? 'Turn manual mode off' : 'Manual mode',
            short: 'Manual Mode',
            glyph: faWrench,
            danger: manualMode,
            description: manualMode
                ? 'On: the rules are not fully enforced'
                : 'Off: ask your opponent to turn it on',
            run: () => dispatch(sendToggleManualModeMessage())
        },
        isPlaying && {
            key: 'report',
            label: 'Report a problem',
            short: 'Report Problem',
            glyph: faBug,
            run: () => {
                dispatch(sendReportProblemMessage());
                setReporting(true);
            }
        },
        isPlaying && {
            key: 'concede',
            label: 'Concede',
            glyph: faFlag,
            run: () => dispatch(sendConcedeMessage()),
            leaving: true
        },
        {
            key: 'leave',
            label: 'Leave game',
            glyph: faRightFromBracket,
            run: leave,
            danger: true,
            leaving: true
        }
    ].filter(Boolean);

    // The game server's connection, as its ping, and who is watching
    const serverState = server.connected
        ? server.responseTime
            ? `${server.responseTime}ms`
            : 'Waiting'
        : server.connecting
          ? 'Connecting'
          : 'Disconnected';
    const serverTone = server.connected
        ? server.responseTime
            ? (server.responseTime < 150 && 'text-success') ||
              (server.responseTime < 300 && 'text-warning') ||
              'text-danger'
            : undefined
        : server.connecting
          ? 'text-warning'
          : 'text-danger';
    const status = [
        {
            key: 'server',
            label: `Game server: ${serverState}`,
            glyph: server.connected ? faCheckCircle : server.connecting ? faTimesCircle : faBan,
            tone: serverTone
        },
        {
            key: 'spectators-status',
            label: `Spectators: ${spectators.length}`,
            glyph: faUsers,
            description: spectatorNames,
            tone: newSpectators ? 'text-warning' : undefined
        }
    ];

    // The buttons are drawn once out of sight to find how wide each is, so as many as fit can be shown
    const measureRef = useRef(null);
    const [widths, setWidths] = useState({});
    const itemsKey = items.map((item) => item.key + item.label).join('|');
    const measuring = room > 0;
    useLayoutEffect(() => {
        const row = measureRef.current;
        if (row) {
            setWidths(
                Object.fromEntries(
                    [...row.children].map((child) => [child.dataset.key, child.offsetWidth])
                )
            );
        }
    }, [itemsKey, measuring]);
    const widthOf = (item) => widths[item.key] ?? Infinity;
    let inBar = new Set();
    if (measuring) {
        const total = items.reduce((sum, item) => sum + widthOf(item), 0);
        if (total <= room) {
            inBar = new Set(items.map((item) => item.key));
        } else {
            let used = menuButtonWidth;
            for (const key of priority) {
                const item = items.find((entry) => entry.key === key);
                if (item && used + widthOf(item) <= room) {
                    used += widthOf(item);
                    inBar.add(key);
                }
            }
        }
    }
    const bar = items.filter((item) => inBar.has(item.key));
    const inMenu = items.filter((item) => !inBar.has(item.key) && !item.barOnly);
    const tools = inMenu.filter((item) => !item.leaving);
    const ways = inMenu.filter((item) => item.leaving);
    const showMenu = !measuring || inMenu.length > 0;
    const run = (key) => items.find((item) => item.key === key)?.run?.();

    const barButton = (item) => (
        <Button
            key={item.key}
            data-key={item.key}
            isIconOnly={item.iconOnly}
            size='sm'
            radius='none'
            variant='light'
            title={item.description ? `${item.label}: ${item.description}` : item.label}
            startContent={item.iconOnly ? undefined : <FontAwesomeIcon icon={item.glyph} />}
            className={classNames('relative h-7 shrink-0 overflow-visible px-2', item.tone, {
                'text-danger': item.danger
            })}
            onPress={item.run}
            onMouseEnter={item.key === 'spectators' ? item.run : undefined}
        >
            {item.iconOnly ? <FontAwesomeIcon icon={item.glyph} /> : (item.short ?? item.label)}
            {item.key === 'spectators' && newSpectators && (
                <span
                    data-spectators-changed=''
                    className='absolute right-0.5 top-0.5 h-2 w-2 rounded-full bg-warning'
                />
            )}
        </Button>
    );
    const menuItem = (item) => (
        <DropdownItem
            key={item.key}
            startContent={icon(item.glyph)}
            description={item.description}
            className={item.danger ? 'text-danger' : undefined}
            color={item.danger ? 'danger' : undefined}
        >
            {item.label}
        </DropdownItem>
    );

    return (
        <div className='relative flex items-center'>
            {measuring && (
                <div
                    ref={measureRef}
                    aria-hidden
                    className='pointer-events-none invisible absolute right-0 top-0 flex'
                >
                    {items.map(barButton)}
                </div>
            )}
            {bar.map(barButton)}
            {manualMode && isPlaying && !inBar.has('manual') && (
                <Button
                    isIconOnly
                    size='sm'
                    variant='light'
                    className='h-7 w-7 min-w-7 text-danger'
                    title='Manual mode is on: the rules are not fully enforced. Tap to turn it off.'
                    onPress={() => run('manual')}
                >
                    <FontAwesomeIcon icon={faWrench} />
                </Button>
            )}
            {showMenu && (
                <Dropdown
                    placement='top-end'
                    onOpenChange={(open) => open && setSpectatorsSeen(spectators.length)}
                >
                    <DropdownTrigger>
                        <Button
                            isIconOnly
                            size='sm'
                            variant='light'
                            className='relative h-7 w-7 min-w-7 overflow-visible'
                            title={
                                newSpectators
                                    ? 'Game menu: the spectators have changed'
                                    : 'Game menu'
                            }
                        >
                            <FontAwesomeIcon icon={faBars} />
                            {newSpectators && !inBar.has('spectators') && (
                                <span
                                    data-spectators-changed=''
                                    className='absolute right-0.5 top-0.5 h-2 w-2 rounded-full bg-warning'
                                />
                            )}
                        </Button>
                    </DropdownTrigger>
                    <DropdownMenu aria-label='Game menu' onAction={run}>
                        <DropdownSection showDivider>
                            {status.map((item) => (
                                <DropdownItem
                                    key={item.key}
                                    isReadOnly
                                    startContent={
                                        <FontAwesomeIcon
                                            icon={item.glyph}
                                            className={classNames('w-4', item.tone)}
                                        />
                                    }
                                    description={item.description}
                                    className={classNames('cursor-default', item.tone)}
                                >
                                    {item.label}
                                </DropdownItem>
                            ))}
                        </DropdownSection>
                        {tools.length > 0 ? (
                            <DropdownSection showDivider={ways.length > 0}>
                                {tools.map(menuItem)}
                            </DropdownSection>
                        ) : null}
                        {ways.length > 0 ? (
                            <DropdownSection>{ways.map(menuItem)}</DropdownSection>
                        ) : null}
                    </DropdownMenu>
                </Dropdown>
            )}
            <ConfirmDialog
                isOpen={confirmingLeave}
                message='Your game is not finished, and you will automatically concede when leaving. Are you sure you want to leave?'
                onOpenChange={setConfirmingLeave}
                onCancel={() => setConfirmingLeave(false)}
                onOk={async () => {
                    dispatch(sendLeaveGameMessage());
                }}
            />
            {isPlaying && (
                <ReportProblemModal
                    isOpen={reporting}
                    onCancel={() => {
                        dispatch(sendCancelProblemReportMessage());
                        setReporting(false);
                    }}
                    onSend={(description) => {
                        dispatch(sendDescribeProblemMessage(description));
                        setReporting(false);
                    }}
                />
            )}
        </div>
    );
};

export default GameMenu;
