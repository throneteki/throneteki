import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
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

// Everything about the game rather than the board: settings, spectators, manual mode, reporting a problem,
// shortcuts, conceding and leaving. It stands in for the navbar, which phone layouts hide. While manual mode is on,
// a wrench beside the menu says so, and turns it off.
const GameMenu = ({ isPlaying, onSettingsClick, onShortcutsClick }) => {
    const dispatch = useDispatch();
    const currentGame = useSelector((state) => state.lobby.currentGame);
    const user = useSelector((state) => state.auth.user);
    const [confirmingLeave, setConfirmingLeave] = useState(false);
    const [reporting, setReporting] = useState(false);
    const manualMode = !!currentGame?.manualMode;
    const muted = !!currentGame?.muteSpectators;

    const leave = () => {
        const everyone = Object.values({ ...currentGame.players, ...currentGame.spectators });
        if (user && everyone.some((a) => a.name === user.username && !a.canSafelyLeave)) {
            setConfirmingLeave(true);
            return;
        }
        dispatch(sendLeaveGameMessage());
    };

    const actions = {
        settings: onSettingsClick,
        shortcuts: onShortcutsClick,
        mute: () => dispatch(sendToggleMuteSpectatorsMessage()),
        manual: () => dispatch(sendToggleManualModeMessage()),
        report: () => {
            dispatch(sendReportProblemMessage());
            setReporting(true);
        },
        concede: () => dispatch(sendConcedeMessage()),
        leave
    };

    const playerItems = isPlaying
        ? [
              <DropdownItem
                  key='mute'
                  startContent={icon(muted ? faEyeSlash : faEye)}
                  description={muted ? 'Spectators cannot chat' : 'Spectators can chat'}
              >
                  {muted ? 'Un-mute spectators' : 'Mute spectators'}
              </DropdownItem>,
              <DropdownItem
                  key='manual'
                  startContent={icon(faWrench)}
                  className={manualMode ? 'text-danger' : undefined}
                  description={
                      manualMode
                          ? 'On: the rules are not fully enforced'
                          : 'Off: ask your opponent to turn it on'
                  }
              >
                  {manualMode ? 'Turn manual mode off' : 'Manual mode'}
              </DropdownItem>,
              <DropdownItem key='report' startContent={icon(faBug)}>
                  Report a problem
              </DropdownItem>
          ]
        : [];

    return (
        <div className='flex items-center'>
            {manualMode && isPlaying && (
                <Button
                    isIconOnly
                    size='sm'
                    variant='light'
                    className='h-7 w-7 min-w-7 text-danger'
                    title='Manual mode is on: the rules are not fully enforced. Tap to turn it off.'
                    onPress={actions.manual}
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
                <DropdownMenu aria-label='Game menu' onAction={(key) => actions[key]?.()}>
                    <DropdownSection showDivider>
                        <DropdownItem key='settings' startContent={icon(faCogs)}>
                            Settings
                        </DropdownItem>
                        <DropdownItem key='shortcuts' startContent={icon(faKeyboard)}>
                            Keyboard shortcuts
                        </DropdownItem>
                        {playerItems}
                    </DropdownSection>
                    <DropdownSection>
                        {isPlaying ? (
                            <DropdownItem key='concede' startContent={icon(faFlag)}>
                                Concede
                            </DropdownItem>
                        ) : null}
                        <DropdownItem
                            key='leave'
                            startContent={icon(faRightFromBracket)}
                            className='text-danger'
                            color='danger'
                        >
                            Leave game
                        </DropdownItem>
                    </DropdownSection>
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
