import React, { useCallback } from 'react';
import Avatar from '../Site/Avatar';
import { useDispatch } from 'react-redux';
import { sendChangeStatMessage } from '../../redux/reducers/game';

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

    const sendUpdate = useCallback(
        (type, direction) => {
            dispatch(sendChangeStatMessage(type, direction === 'up' ? 1 : -1));
        },
        [dispatch]
    );

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
                <div className='state'>
                    <span>
                        <img
                            src={'/img/' + name + '.png'}
                            title={name}
                            alt={name}
                            style={{ width: '27px', height: '27px' }}
                        />
                    </span>
                    {showControls ? (
                        <button
                            className='btn btn-stat'
                            onClick={() => sendUpdate(statToSet, 'down')}
                        >
                            <img src='/img/Minus.png' title='-' alt='-' />
                        </button>
                    ) : null}

                    <span>{getStatValueOrDefault(stat)}</span>
                    {showControls ? (
                        <button
                            className='btn btn-stat'
                            onClick={() => sendUpdate(statToSet, 'up')}
                        >
                            <img src='/img/Plus.png' title='+' alt='+' />
                        </button>
                    ) : null}
                </div>
            );
        },
        [sendUpdate, getStatValueOrDefault, showControls]
    );

    const handleSettingsClick = useCallback(
        (event) => {
            event.preventDefault();

            if (onSettingsClick) {
                onSettingsClick();
            }
        },
        [onSettingsClick]
    );

    const playerAvatar = (
        <div className='player-avatar'>
            <Avatar username={user ? user.username : undefined} />
            <b>{user ? user.username : 'Noone'}</b>
        </div>
    );

    let muteClass = muteSpectators ? 'glyphicon-eye-close' : 'glyphicon-eye-open';

    return (
        <div className='panel player-stats'>
            {playerAvatar}

            {getButton('gold', 'Gold')}
            {getButton('totalPower', 'Power', 'power')}
            {getButton('initiative', 'Initiative')}
            {getButton('claim', 'Claim')}
            {getButton('reserve', 'Reserve')}

            {firstPlayer ? (
                <div className='state'>
                    <div className='first-player'>First player</div>
                </div>
            ) : null}

            {showControls ? (
                <div className='state'>
                    <button className='btn btn-transparent' onClick={handleSettingsClick}>
                        <span className='glyphicon glyphicon-cog' />
                        Settings
                    </button>
                </div>
            ) : null}

            {showControls && (
                <div className='state chat-status'>
                    <div className='state' onClick={onMuteClick}>
                        <button className='btn btn-transparent'>
                            <span className={`glyphicon ${muteClass}`} />
                        </button>
                    </div>
                    <div className='state' onClick={onMessagesClick}>
                        <button className='btn btn-transparent'>
                            <span className='glyphicon glyphicon-envelope' />
                            <span className='chat-badge badge progress-bar-danger'>
                                {numMessages || null}
                            </span>
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
};

export default PlayerStats;
