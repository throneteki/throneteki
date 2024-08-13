import React, { useCallback } from 'react';
import { useDispatch } from 'react-redux';
import { sendChangeStatMessage } from '../../redux/reducers/game';
import { Avatar, Badge } from '@nextui-org/react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCogs, faComment, faCopy, faEye, faEyeSlash } from '@fortawesome/free-solid-svg-icons';
import StatContainer from './StatContainer';
import StatDisplay from './StatDisplay';
import { toastr } from 'react-redux-toastr';

const PlayerStats = ({
    stats,
    showControls,
    showMessages = false,
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

    const getButton = useCallback(
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

    const writeChatToClipboard = useCallback((event) => {
        event.preventDefault();
        const messagePanel = document.getElementsByClassName('messages panel')[0];
        if (messagePanel) {
            navigator.clipboard
                .writeText(messagePanel.innerText)
                .then(() => toastr.success('Copied game chat to clipboard', null))
                .catch((err) => toastr.error(`Could not copy game chat: ${err}`, null));
        }
    }, []);

    return (
        <div className='relative margin-2 border-1 border-default-200 bg-black bg-opacity-65 player-stats'>
            <div className={`pr-1 py-1 flex items-center`}>
                <Avatar src={`/img/avatar/${user?.username}.png`} showFallback size='sm' />

                <span className='pl-2 font-bold'>{user?.username || 'Noone'}</span>
            </div>
            {getButton('gold', 'Gold')}
            {getButton('totalPower', 'Power', 'power')}
            {getButton('initiative', 'Initiative')}
            {getButton('claim', 'Claim')}
            {getButton('reserve', 'Reserve')}

            {firstPlayer ? (
                <StatContainer>
                    <div className='first-player'>First player</div>
                </StatContainer>
            ) : null}

            {showMessages && (
                <StatContainer>
                    <StatContainer>
                        <a href='#' onClick={onSettingsClick} className='pl-1 pr-1'>
                            <FontAwesomeIcon icon={faCogs}></FontAwesomeIcon>
                            <span className='ml-1'>{'Settings'}</span>
                        </a>
                    </StatContainer>
                    <StatContainer>
                        <a href='#' className='pl-1 pr-1'>
                            <FontAwesomeIcon
                                icon={muteSpectators ? faEyeSlash : faEye}
                                onClick={onMuteClick}
                            ></FontAwesomeIcon>
                        </a>
                    </StatContainer>
                    <StatContainer>
                        <a href='#' className='pl-1 pr-1'>
                            <FontAwesomeIcon
                                icon={faCopy}
                                onClick={writeChatToClipboard}
                            ></FontAwesomeIcon>
                        </a>
                    </StatContainer>
                    <StatContainer>
                        <a href='#' onClick={onMessagesClick} className='pl-1'>
                            <FontAwesomeIcon icon={faComment}></FontAwesomeIcon>
                            {numMessages > 0 && <Badge color='danger'>{numMessages}</Badge>}
                        </a>
                    </StatContainer>
                </StatContainer>
            )}
        </div>
    );
};

export default PlayerStats;
