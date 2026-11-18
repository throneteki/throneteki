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
    faBars,
    faBug,
    faCogs,
    faEye,
    faEyeSlash,
    faFlag,
    faKeyboard,
    faRightFromBracket,
    faWrench
} from '@fortawesome/free-solid-svg-icons';
import ConfirmDialog from '../../Site/ConfirmDialog';
import ReportProblemModal from '../ReportProblemModal';
import {
    sendConcedeMessage,
    sendDescribeProblemMessage,
    sendLeaveGameMessage,
    sendReportProblemMessage,
    sendToggleManualModeMessage,
    sendToggleMuteSpectatorsMessage
} from '../../../redux/reducers/game';

const icon = (glyph) => <FontAwesomeIcon icon={glyph} className='w-4' />;
// Room kept for the menu button itself, which is always shown
const menuButtonWidth = 32;

// Everything about the game rather than the board: settings, spectators, manual mode, reporting a problem,
// shortcuts, conceding and leaving. It stands in for the navbar, which phone layouts hide. Given room (in pixels) it
// shows as many of the first few as buttons, as classic does, and keeps the rest in the menu, which is always there.
// While manual mode is on and it is in the menu, a wrench beside the menu says so, and turns it off.
const GameMenu = ({ isPlaying, onSettingsClick, onShortcutsClick, room = 0 }) => {
    const dispatch = useDispatch();
    const currentGame = useSelector((state) => state.lobby.currentGame);
    const user = useSelector((state) => state.auth.user);
    const [confirmingLeave, setConfirmingLeave] = useState(false);
    const [reporting, setReporting] = useState(false);
    const manualMode = !!currentGame?.manualMode;
    const muted = !!currentGame?.muteSpectators;
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

    // In the order they are given room as buttons; the last section only ever lives in the menu
    const items = [
        { key: 'settings', label: 'Settings', glyph: faCogs, run: onSettingsClick, inline: true },
        isPlaying && {
            key: 'manual',
            label: manualMode ? 'Turn manual mode off' : 'Manual mode',
            short: 'Manual Mode',
            glyph: faWrench,
            danger: manualMode,
            description: manualMode
                ? 'On: the rules are not fully enforced'
                : 'Off: ask your opponent to turn it on',
            run: () => dispatch(sendToggleManualModeMessage()),
            inline: true
        },
        isPlaying && {
            key: 'mute',
            label: muted ? 'Un-mute spectators' : 'Mute spectators',
            glyph: muted ? faEyeSlash : faEye,
            description: muted ? 'Spectators cannot chat' : 'Spectators can chat',
            run: () => dispatch(sendToggleMuteSpectatorsMessage()),
            inline: true,
            iconOnly: true
        },
        isPlaying && {
            key: 'report',
            label: 'Report a problem',
            short: 'Report Problem',
            glyph: faBug,
            run: () => {
                dispatch(sendReportProblemMessage());
                setReporting(true);
            },
            inline: true
        },
        hasKeyboard && {
            key: 'shortcuts',
            label: 'Keyboard shortcuts',
            glyph: faKeyboard,
            run: onShortcutsClick
        }
    ].filter(Boolean);
    const leaving = [
        isPlaying && {
            key: 'concede',
            label: 'Concede',
            glyph: faFlag,
            run: () => dispatch(sendConcedeMessage())
        },
        { key: 'leave', label: 'Leave game', glyph: faRightFromBracket, run: leave, danger: true }
    ].filter(Boolean);

    // The buttons are drawn once out of sight to find how wide each is, so as many as fit can be shown
    const measureRef = useRef(null);
    const [widths, setWidths] = useState([]);
    const inlineItems = items.filter((item) => item.inline);
    const inlineKey = inlineItems.map((item) => item.key + item.label).join('|');
    useLayoutEffect(() => {
        const row = measureRef.current;
        if (row) {
            setWidths([...row.children].map((child) => child.offsetWidth));
        }
    }, [inlineKey]);
    let shown = 0;
    let used = menuButtonWidth;
    while (shown < inlineItems.length && used + (widths[shown] ?? Infinity) <= room) {
        used += widths[shown];
        shown++;
    }
    const inline = inlineItems.slice(0, shown);
    const inMenu = items.filter((item) => !inline.includes(item));
    const run = (key) => [...items, ...leaving].find((item) => item.key === key)?.run?.();

    const inlineButton = (item) => (
        <Button
            key={item.key}
            isIconOnly={item.iconOnly}
            size='sm'
            radius='none'
            variant='light'
            title={item.description ? `${item.label}: ${item.description}` : item.label}
            startContent={item.iconOnly ? undefined : <FontAwesomeIcon icon={item.glyph} />}
            className={classNames('h-7 shrink-0 px-2', { 'text-danger': item.danger })}
            onPress={item.run}
        >
            {item.iconOnly ? <FontAwesomeIcon icon={item.glyph} /> : (item.short ?? item.label)}
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
            <div
                ref={measureRef}
                aria-hidden
                className='pointer-events-none invisible absolute right-0 top-0 flex'
            >
                {inlineItems.map(inlineButton)}
            </div>
            {inline.map(inlineButton)}
            {manualMode && isPlaying && !inline.some((item) => item.key === 'manual') && (
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
            <Dropdown placement='top-end'>
                <DropdownTrigger>
                    <Button
                        isIconOnly
                        size='sm'
                        variant='light'
                        className='h-7 w-7 min-w-7'
                        title='Game menu'
                    >
                        <FontAwesomeIcon icon={faBars} />
                    </Button>
                </DropdownTrigger>
                <DropdownMenu aria-label='Game menu' onAction={run}>
                    {inMenu.length > 0 ? (
                        <DropdownSection showDivider>{inMenu.map(menuItem)}</DropdownSection>
                    ) : null}
                    <DropdownSection>{leaving.map(menuItem)}</DropdownSection>
                </DropdownMenu>
            </Dropdown>
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
                    onClose={() => setReporting(false)}
                    onSend={(description) => dispatch(sendDescribeProblemMessage(description))}
                />
            )}
        </div>
    );
};

export default GameMenu;
