import React, { useCallback, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {
    sendChangeStatMessage,
    sendToggleManualModeMessage,
    sendReportProblemMessage,
    sendDescribeProblemMessage,
    sendCancelProblemReportMessage,
    sendToggleMuteSpectatorsMessage
} from '../../../redux/reducers/game';
import { Button } from '@heroui/react';
import UserAvatar from '../../Site/UserAvatar';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faBug, faCogs, faEye, faEyeSlash, faWrench } from '@fortawesome/free-solid-svg-icons';
import StatContainer from '../StatContainer';
import StatDisplay from '../StatDisplay';
import classNames from 'classnames';
import ReportProblemModal from '../ReportProblemModal';

const PlayerStats = ({
    className,
    stats,
    showControls,
    onSettingsClick,
    user: userProp,
    firstPlayer,
    seatNo
}) => {
    const dispatch = useDispatch();
    const [isReportOpen, setReportOpen] = useState(false);
    const currentGame = useSelector((state) => state.lobby.currentGame);
    const user = useSelector((state) => state.auth.user);
    const isMe = userProp?.username === user?.username;
    const canChangeStats = isMe && !!currentGame?.manualMode;

    const getStatValueOrDefault = useCallback(
        (stat) => {
            if (!stats) {
                return 0;
            }

            return stats[stat] || 0;
        },
        [stats]
    );

    const getStatDisplay = useCallback(
        (stat, name, statToSet = stat) => {
            return (
                <StatContainer title={name}>
                    <StatDisplay
                        showControls={canChangeStats}
                        statName={name}
                        statCode={stat}
                        statValue={getStatValueOrDefault(stat)}
                        onMinusClick={
                            canChangeStats
                                ? () => dispatch(sendChangeStatMessage(statToSet, -1))
                                : null
                        }
                        onPlusClick={
                            canChangeStats
                                ? () => dispatch(sendChangeStatMessage(statToSet, 1))
                                : null
                        }
                    />
                </StatContainer>
            );
        },
        [canChangeStats, getStatValueOrDefault, dispatch]
    );

    const getStatButton = (onClick, icon, title, text, active = false) => (
        <StatContainer title={title}>
            <Button
                isIconOnly={!text}
                aria-label={title}
                onPress={onClick}
                size='sm'
                className={classNames('h-8 px-2', active ? 'text-danger' : 'text-ink-dim')}
                variant='ghost'
            >
                {icon ? <FontAwesomeIcon icon={icon} /> : null}
                {text && <span className='max-md:hidden'>{text}</span>}
            </Button>
        </StatContainer>
    );

    const wrapperClassName = classNames(
        'relative hud-zoom shrink-0 overflow-x-auto border-y border-gold-hair bg-[#0c0d11]/85 [scrollbar-width:none]',
        className
    );
    return (
        <div className={wrapperClassName}>
            <div className='sticky left-0 flex items-center w-fit px-2'>
                <div className='pr-1 py-1 flex items-center'>
                    <UserAvatar username={userProp?.username} className='w-7 h-7 text-xs' />

                    <span className='pl-2 font-semibold text-ink max-md:hidden'>
                        {userProp?.username || 'Empty seat'}
                    </span>
                </div>
                {getStatDisplay('totalPower', 'Power', 'power')}
                {getStatDisplay('gold', 'Gold')}
                {getStatDisplay('initiative', 'Initiative')}
                {getStatDisplay('claim', 'Claim')}
                {getStatDisplay('reserve', 'Reserve')}
                {seatNo && (
                    <StatContainer>
                        <div className='px-2 text-sm text-ink-dim'>{`Seat ${seatNo}`}</div>
                    </StatContainer>
                )}
                {firstPlayer && (
                    <StatContainer>
                        <div className='px-2 text-sm text-gold' title='First player'>
                            <span className='max-md:hidden'>First player</span>
                            <span className='md:hidden'>1st</span>
                        </div>
                    </StatContainer>
                )}

                <StatContainer>
                    {showControls && (
                        <>
                            {getStatButton(onSettingsClick, faCogs, 'Game settings', 'Settings')}
                            {isMe &&
                                getStatButton(
                                    () => dispatch(sendToggleMuteSpectatorsMessage()),
                                    currentGame.muteSpectators ? faEyeSlash : faEye,
                                    currentGame.muteSpectators
                                        ? 'Un-mute spectators'
                                        : 'Mute spectators'
                                )}
                            {isMe &&
                                getStatButton(
                                    () => dispatch(sendToggleManualModeMessage()),
                                    faWrench,
                                    currentGame.manualMode
                                        ? 'Manual mode is on: the rules are not fully enforced, and players can change the game by hand. Click to turn it off.'
                                        : 'Manual mode is off: the game enforces the rules, and manual changes are disabled. Click to ask your opponent to turn it on.',
                                    currentGame.manualMode ? 'Manual mode on' : 'Manual mode',
                                    currentGame.manualMode
                                )}
                            {isMe &&
                                getStatButton(
                                    () => {
                                        dispatch(sendReportProblemMessage());
                                        setReportOpen(true);
                                    },
                                    faBug,
                                    'Report a problem with this game',
                                    'Report a problem'
                                )}
                        </>
                    )}
                </StatContainer>
            </div>
            {isMe && (
                <ReportProblemModal
                    isOpen={isReportOpen}
                    onCancel={() => {
                        dispatch(sendCancelProblemReportMessage());
                        setReportOpen(false);
                    }}
                    onSend={(description) => {
                        dispatch(sendDescribeProblemMessage(description));
                        setReportOpen(false);
                    }}
                />
            )}
        </div>
    );
};

export default PlayerStats;
