import React, { useCallback } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {
    sendChangeStatMessage,
    sendToggleManualModeMessage,
    sendReportProblemMessage,
    sendToggleMuteSpectatorsMessage
} from '../../redux/reducers/game';
import { Avatar, Badge, Button } from '@heroui/react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
    faBug,
    faCogs,
    faComment,
    faEye,
    faEyeSlash,
    faWrench
} from '@fortawesome/free-solid-svg-icons';
import StatContainer from './StatContainer';
import StatDisplay from './StatDisplay';
import classNames from 'classnames';

const PlayerStats = ({
    className,
    stats,
    showControls,
    onSettingsClick,
    user: userProp,
    firstPlayer,
    onChatToggle,
    unreadMessages,
    seatNo
}) => {
    const dispatch = useDispatch();
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
                onPress={onClick}
                startContent={icon ? <FontAwesomeIcon icon={icon} /> : null}
                radius='none'
                variant='light'
                className={classNames('h-8 p-2', { 'text-danger': active })}
            >
                {text}
            </Button>
        </StatContainer>
    );

    const wrapperClassName = classNames(
        'relative border-1 border-default-100 bg-black/35 border-x-0',
        className
    );
    return (
        <div className={wrapperClassName}>
            <div className='sticky left-0 flex items-center w-fit px-2'>
                <div className='pr-1 py-1 flex items-center'>
                    <Avatar
                        src={`/img/avatar/${userProp?.username}.png`}
                        showFallback
                        className='w-7 h-7 text-tiny'
                    />

                    <span className='pl-2 font-bold max-md:hidden'>
                        {userProp?.username || 'Noone'}
                    </span>
                </div>
                {getStatDisplay('totalPower', 'Power', 'power')}
                {getStatDisplay('gold', 'Gold')}
                {getStatDisplay('initiative', 'Initiative')}
                {getStatDisplay('claim', 'Claim')}
                {getStatDisplay('reserve', 'Reserve')}
                {seatNo && (
                    <StatContainer>
                        <div className='px-2'>{`Seat ${seatNo}`}</div>
                    </StatContainer>
                )}
                {firstPlayer && (
                    <StatContainer>
                        <div className='px-2'>First player</div>
                    </StatContainer>
                )}

                <StatContainer>
                    {showControls && (
                        <>
                            {getStatButton(onSettingsClick, faCogs, 'Open Settings', 'Settings')}
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
                                        ? 'Turn manual mode off'
                                        : 'Ask to turn manual mode on',
                                    'Manual Mode',
                                    currentGame.manualMode
                                )}
                            {isMe &&
                                getStatButton(
                                    () => dispatch(sendReportProblemMessage()),
                                    faBug,
                                    'Report a problem with this game',
                                    'Report Problem'
                                )}
                            <StatContainer>
                                <Badge
                                    shape='circle'
                                    color='danger'
                                    content={unreadMessages > 99 ? '99+' : unreadMessages}
                                    isInvisible={!unreadMessages || unreadMessages === 0}
                                >
                                    {getStatButton(onChatToggle, faComment, 'Toggle chat')}
                                </Badge>
                            </StatContainer>
                        </>
                    )}
                </StatContainer>
            </div>
        </div>
    );
};

export default PlayerStats;
