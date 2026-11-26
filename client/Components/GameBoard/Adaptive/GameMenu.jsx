import React, { useEffect, useLayoutEffect, useRef, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import classNames from 'classnames';
import { Description, Dropdown, Label, Popover, Separator } from '@heroui/react';
import Button from '../../Site/Button';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
    faBars,
    faBug,
    faChevronRight,
    faCogs,
    faEye,
    faEyeSlash,
    faFlag,
    faKeyboard,
    faRightFromBracket,
    faTrophy,
    faUsers,
    faWrench
} from '@fortawesome/free-solid-svg-icons';
import ConfirmDialog from '../../Site/ConfirmDialog';
import { connectionIconOf, pingLevelOf, pingTextOf } from '../../Navigation/ServerStatus';
import { SpectatorList, SpectatorSheet, spectatorPreview } from './SpectatorList';
import ReportProblemModal from '../ReportProblemModal';
import {
    sendCancelProblemReportMessage,
    sendConcedeMessage,
    sendDescribeProblemMessage,
    mustConfirmLeave,
    sendLeaveGameMessage,
    sendReportProblemMessage,
    sendToggleManualModeMessage,
    sendToggleMuteSpectatorsMessage
} from '../../../redux/reducers/game';
import { boardNavbarStore, useBoardNavbar } from '../../../boardLayoutStore';
import { useHud } from '../../../hudStore';
import { overlaySettingsOf } from '../../../hud';
import { replayEndOverlay } from './BoardOverlays';

const pingTones = { success: 'text-success', warning: 'text-warning', danger: 'text-danger' };

const icon = (glyph) => <FontAwesomeIcon icon={glyph} className='w-4' />;
const MenuText = ({ label, description }) => (
    <span className='flex min-w-0 flex-col'>
        <Label>{label}</Label>
        {description && <Description>{description}</Description>}
    </span>
);
// Room kept for the menu button, when anything is left for it to hold
const menuButtonWidth = 36;
// The line between two groups of buttons in the bar, with its margins
const groupGapWidth = 9;
const GroupGap = () => (
    <span aria-hidden className='mx-1 my-2 w-px shrink-0 self-stretch bg-white/[0.060]' />
);

// Which items keep their place in the bar first when not all of them fit
const priority = [
    'settings',
    'result',
    'leave',
    'manual',
    'concede',
    'report',
    'spectators',
    'mute',
    'shortcuts'
];

// The game's menu, standing in for the navbar on phones. room (px): space in the desktop bar for items as buttons;
// as many as fit are shown there, the rest in the menu. With no room, a wrench beside it shows manual mode is on.
const GameMenu = ({ isPlaying, onSettingsClick, onShortcutsClick, room = 0 }) => {
    const dispatch = useDispatch();
    const currentGame = useSelector((state) => state.lobby.currentGame);
    const user = useSelector((state) => state.auth.user);
    const [confirmingLeave, setConfirmingLeave] = useState(false);
    const [reporting, setReporting] = useState(false);
    const [watching, setWatching] = useState(false);
    const [menuOpen, setMenuOpen] = useState(false);
    // Once the game is over, its end overlay can be seen again (where overlays are shown at all)
    const overlaysShown = overlaySettingsOf(useHud()).enabled;
    const canReplay = !!currentGame?.gameOver && overlaysShown;
    const { navMenu } = useBoardNavbar();
    useEffect(() => {
        boardNavbarStore.set('gameMenu', menuOpen);
    }, [menuOpen]);
    useEffect(() => () => boardNavbarStore.set('gameMenu', false), []);
    // The navbar's own menu covers the board, so the game menu gives way to it
    useEffect(() => {
        if (navMenu) {
            setMenuOpen(false);
        }
    }, [navMenu]);
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
        if (mustConfirmLeave(currentGame, user)) {
            setConfirmingLeave(true);
            return;
        }
        dispatch(sendLeaveGameMessage());
    };

    const spectatorNames = spectatorPreview(spectators);

    // In the bar's order. Only the ways out are named in the bar; spectators is a bar button, in the menu a status row.
    const items = [
        // First, named and gold, so it is found once the game is over
        canReplay && {
            key: 'result',
            group: 'result',
            label: 'View result',
            glyph: faTrophy,
            description: 'Who won, as shown at the end',
            tone: 'text-warning',
            run: replayEndOverlay,
            named: true
        },
        {
            key: 'spectators',
            group: 'watch',
            label: `Spectators: ${spectators.length}`,
            glyph: faUsers,
            description: spectatorNames,
            tone: newSpectators ? 'text-warning' : undefined,
            run: () => setSpectatorsSeen(spectators.length),
            barOnly: true
        },
        isPlaying && {
            key: 'mute',
            group: 'watch',
            label: muted ? 'Un-mute spectators' : 'Mute spectators',
            glyph: muted ? faEyeSlash : faEye,
            description: muted ? 'Spectators cannot chat' : 'Spectators can chat',
            run: () => dispatch(sendToggleMuteSpectatorsMessage())
        },
        { key: 'settings', group: 'tools', label: 'Settings', glyph: faCogs, run: onSettingsClick },
        hasKeyboard && {
            key: 'shortcuts',
            group: 'tools',
            label: 'Keyboard shortcuts',
            glyph: faKeyboard,
            run: onShortcutsClick
        },
        isPlaying && {
            key: 'manual',
            group: 'tools',
            label: manualMode ? 'Turn manual mode off' : 'Manual mode',
            glyph: faWrench,
            danger: manualMode,
            description: manualMode
                ? 'On: the rules are not fully enforced'
                : 'Off: ask your opponent to turn it on',
            run: () => dispatch(sendToggleManualModeMessage())
        },
        isPlaying && {
            key: 'report',
            group: 'tools',
            label: 'Report a problem',
            glyph: faBug,
            run: () => {
                dispatch(sendReportProblemMessage());
                setReporting(true);
            }
        },
        isPlaying && {
            key: 'concede',
            group: 'out',
            label: 'Concede',
            glyph: faFlag,
            run: () => dispatch(sendConcedeMessage()),
            leaving: true,
            named: true
        },
        {
            key: 'leave',
            group: 'out',
            label: 'Leave game',
            short: 'Leave',
            glyph: faRightFromBracket,
            run: leave,
            danger: true,
            leaving: true,
            named: true
        }
    ].filter(Boolean);

    // The game server's connection, as its ping, and who is watching
    const status = [
        {
            key: 'server',
            label: `Game server: ${pingTextOf(server)}`,
            glyph: connectionIconOf(server),
            tone: pingTones[pingLevelOf(server)]
        },
        {
            key: 'spectators-status',
            label: `Spectators: ${spectators.length}`,
            glyph: faUsers,
            description: spectatorNames,
            tone: newSpectators ? 'text-warning' : undefined,
            opens: true
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
        const groups = new Set(items.map((item) => item.group)).size;
        const total = items.reduce(
            (sum, item) => sum + widthOf(item),
            (groups - 1) * groupGapWidth
        );
        if (total <= room) {
            inBar = new Set(items.map((item) => item.key));
        } else {
            let used = menuButtonWidth + groups * groupGapWidth;
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

    // A button in the bar, as tall as the bar: the ways out are named, the rest are icons (spectators with their count)
    const barButton = (item, measure = false) => {
        const button = (
            <Button
                key={item.key}
                data-key={item.key}
                size='sm'
                variant='ghost'
                title={item.description ? `${item.label}: ${item.description}` : item.label}
                aria-label={item.label}
                className={classNames(
                    'relative h-full shrink-0 overflow-visible rounded-none',
                    item.named ? 'min-w-0 gap-1.5 px-2.5 text-sm' : 'min-w-9 gap-1 px-2',
                    item.tone,
                    { 'text-danger': item.danger }
                )}
                onPress={item.key === 'spectators' ? undefined : item.run}
            >
                {item.named ? (
                    <>
                        <FontAwesomeIcon icon={item.glyph} className='text-base' />
                        {item.short ?? item.label}
                    </>
                ) : (
                    <FontAwesomeIcon icon={item.glyph} className='text-base' />
                )}
                {item.key === 'spectators' && (
                    <span className='text-xs font-semibold tabular-nums'>{spectators.length}</span>
                )}
                {item.key === 'spectators' && newSpectators && (
                    <span
                        data-spectators-changed=''
                        className='absolute right-0.5 top-1 h-2 w-2 rounded-full bg-warning'
                    />
                )}
            </Button>
        );
        if (measure || item.key !== 'spectators') {
            return button;
        }
        // Spectators opens a list of who is watching
        return (
            <Popover key={item.key} onOpenChange={(open) => open && item.run()}>
                {button}
                <Popover.Content
                    placement='top'
                    offset={6}
                    className='hud-zoom border border-gold-line bg-[#0c0d11]/95 p-2'
                >
                    <Popover.Dialog aria-label='Spectators'>
                        <SpectatorList spectators={spectators} />
                    </Popover.Dialog>
                </Popover.Content>
            </Popover>
        );
    };
    // The bar's buttons in their groups, a thin line between each group
    const barGroups = (list) =>
        list.reduce((groups, item) => {
            const last = groups[groups.length - 1];
            if (last && last.group === item.group) {
                last.items.push(item);
            } else {
                groups.push({ group: item.group, items: [item] });
            }
            return groups;
        }, []);
    const menuItem = (item) => (
        <Dropdown.Item
            key={item.key}
            id={item.key}
            textValue={item.label}
            variant={item.danger ? 'danger' : undefined}
            className={classNames('gap-2', item.danger ? 'text-danger' : item.tone)}
        >
            {icon(item.glyph)}
            <MenuText label={item.label} description={item.description} />
        </Dropdown.Item>
    );

    return (
        <div
            className={classNames(
                'relative flex',
                measuring ? 'h-full items-stretch' : 'items-center'
            )}
        >
            {measuring && (
                <div
                    ref={measureRef}
                    aria-hidden
                    className='pointer-events-none invisible absolute right-0 top-0 flex h-full'
                >
                    {items.map((item) => barButton(item, true))}
                </div>
            )}
            {barGroups(bar).map(({ group, items: grouped }, index) => (
                <React.Fragment key={group}>
                    {index > 0 && <GroupGap />}
                    {grouped.map((item) => barButton(item))}
                </React.Fragment>
            ))}
            {bar.length > 0 && showMenu && <GroupGap />}
            {manualMode && isPlaying && !inBar.has('manual') && (
                <Button
                    isIconOnly
                    size='sm'
                    variant='ghost'
                    className={classNames(
                        'min-w-7 text-danger',
                        measuring ? 'h-full w-9' : 'h-7 w-7'
                    )}
                    title='Manual mode is on: the rules are not fully enforced. Tap to turn it off.'
                    onPress={() => run('manual')}
                >
                    <FontAwesomeIcon icon={faWrench} className='text-base' />
                </Button>
            )}
            {showMenu && (
                <Dropdown
                    isOpen={menuOpen}
                    onOpenChange={(open) => {
                        setMenuOpen(open);
                        if (open) {
                            setSpectatorsSeen(spectators.length);
                        }
                    }}
                >
                    <Button
                        isIconOnly
                        size='sm'
                        variant='ghost'
                        className={classNames(
                            'relative min-w-7 overflow-visible',
                            measuring ? 'h-full w-9 rounded-none' : 'h-7 w-7'
                        )}
                        title={
                            newSpectators ? 'Game menu: the spectators have changed' : 'Game menu'
                        }
                    >
                        <FontAwesomeIcon icon={faBars} className='text-base' />
                        {newSpectators && !inBar.has('spectators') && (
                            <span
                                data-spectators-changed=''
                                className='absolute right-0.5 top-0.5 h-2 w-2 rounded-full bg-warning'
                            />
                        )}
                    </Button>
                    <Dropdown.Popover
                        placement='top end'
                        className='min-w-56'
                        // The navbar shown with it (BoardNavBar) is used without closing the menu
                        shouldCloseOnInteractOutside={(element) =>
                            !element.closest('[data-board-navbar]')
                        }
                    >
                        <Dropdown.Menu
                            aria-label='Game menu'
                            onAction={(key) =>
                                key === 'spectators-status'
                                    ? setWatching(true)
                                    : status.some((item) => item.key === key)
                                      ? undefined
                                      : run(key)
                            }
                        >
                            <Dropdown.Section>
                                {status.map((item) => (
                                    <Dropdown.Item
                                        key={item.key}
                                        id={item.key}
                                        textValue={item.label}
                                        className={classNames(
                                            'gap-2',
                                            { 'cursor-default': !item.opens },
                                            item.tone
                                        )}
                                    >
                                        <FontAwesomeIcon
                                            icon={item.glyph}
                                            className={classNames('w-4', item.tone)}
                                        />
                                        <MenuText
                                            label={item.label}
                                            description={item.description}
                                        />
                                        {item.opens && (
                                            <FontAwesomeIcon
                                                icon={faChevronRight}
                                                className='ml-auto text-xs text-ink-faint'
                                            />
                                        )}
                                    </Dropdown.Item>
                                ))}
                            </Dropdown.Section>
                            {tools.length > 0 && <Separator />}
                            {tools.length > 0 && (
                                <Dropdown.Section>{tools.map(menuItem)}</Dropdown.Section>
                            )}
                            {ways.length > 0 && <Separator />}
                            {ways.length > 0 && (
                                <Dropdown.Section>{ways.map(menuItem)}</Dropdown.Section>
                            )}
                        </Dropdown.Menu>
                    </Dropdown.Popover>
                </Dropdown>
            )}
            <SpectatorSheet
                isOpen={watching}
                onOpenChange={setWatching}
                spectators={spectators}
                muted={muted}
                onToggleMute={
                    isPlaying ? () => dispatch(sendToggleMuteSpectatorsMessage()) : undefined
                }
            />
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
