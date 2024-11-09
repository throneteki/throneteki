import React, { useCallback } from 'react';
import { useDispatch } from 'react-redux';
import { sendChangeStatMessage } from '../../redux/reducers/game';
import { Avatar, Badge, Button } from '@nextui-org/react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCogs, faComment, faCopy, faEye, faEyeSlash } from '@fortawesome/free-solid-svg-icons';
import StatContainer from './StatContainer';
import StatDisplay from './StatDisplay';
import { toast } from 'react-toastify';

const PlayerStats = ({
    stats,
    showControls,
    onSettingsClick,
    user,
    muteSpectators,
    firstPlayer,
    onMuteClick,
    onMessagesClick,
    numMessages
}) => {
    const dispatch = useDispatch();

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
                        showControls={showControls}
                        statName={name}
                        statCode={stat}
                        statValue={getStatValueOrDefault(stat)}
                        onMinusClick={
                            showControls
                                ? () => dispatch(sendChangeStatMessage(statToSet, -1))
                                : null
                        }
                        onPlusClick={
                            showControls
                                ? () => dispatch(sendChangeStatMessage(statToSet, 1))
                                : null
                        }
                    />
                </StatContainer>
            );
        },
        [showControls, getStatValueOrDefault, dispatch]
    );

    const getStatButton = (onClick, icon, title, text) => (
        <StatContainer title={title}>
            <Button
                isIconOnly={!text}
                onClick={onClick}
                startContent={icon ? <FontAwesomeIcon icon={icon} /> : null}
                radius='none'
                variant='light'
                className='h-8 p-2'
            >
                {text}
            </Button>
        </StatContainer>
    );
    const writeChatToClipboard = useCallback((event) => {
        event.preventDefault();
        const messagePanel = document.getElementById('messages-panel');

        if (messagePanel) {
            navigator.clipboard
                .writeText(messagePanel.innerText)
                .then(() => toast.success('Copied game chat to clipboard', null))
                .catch((err) => toast.error(`Could not copy game chat: ${err}`, null));
        }
    }, []);

    return (
        <div className='relative px-2 border-1 border-default-100 bg-black/35 flex items-center border-x-0'>
            <div className='pr-1 py-1 flex items-center'>
                <Avatar
                    src={`/img/avatar/${user?.username}.png`}
                    showFallback
                    className='w-7 h-7 text-tiny'
                />

                <span className='pl-2 font-bold'>{user?.username || 'Noone'}</span>
            </div>
            {getStatDisplay('totalPower', 'Power', 'power')}
            {getStatDisplay('gold', 'Gold')}
            {getStatDisplay('initiative', 'Initiative')}
            {getStatDisplay('claim', 'Claim')}
            {getStatDisplay('reserve', 'Reserve')}

            {firstPlayer ? (
                <StatContainer>
                    <div className='first-player px-2'>First player</div>
                </StatContainer>
            ) : null}

            <StatContainer>
                {showControls && (
                    <>
                        {getStatButton(onSettingsClick, faCogs, 'Open Settings', 'Settings')}
                        {getStatButton(
                            onMuteClick,
                            muteSpectators ? faEyeSlash : faEye,
                            muteSpectators ? 'Un-mute spectators' : 'Mute spectators'
                        )}
                    </>
                )}
                {getStatButton(writeChatToClipboard, faCopy, 'Copy chat log')}
                <StatContainer>
                    <Badge
                        shape='circle'
                        color='danger'
                        content={numMessages > 99 ? '99+' : numMessages}
                        isInvisible={!numMessages || numMessages === 0}
                    >
                        {getStatButton(onMessagesClick, faComment, 'Toggle chat')}
                    </Badge>
                </StatContainer>
            </StatContainer>
        </div>
    );
};

export default PlayerStats;
