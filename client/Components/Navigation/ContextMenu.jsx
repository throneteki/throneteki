import React, { useCallback, useMemo, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {
    mustConfirmLeave,
    sendConcedeMessage,
    sendLeaveGameMessage
} from '../../redux/reducers/game';
import { Tooltip } from '@heroui/react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faWarning } from '@fortawesome/free-solid-svg-icons';

const ContextMenu = ({ onPress = () => true }) => {
    const dispatch = useDispatch();
    const { currentGame } = useSelector((state) => state.lobby);
    const { user } = useSelector((state) => state.auth);

    const [lastSpectatorCount, setLastSpectatorCount] = useState(0);
    const [showSpectatorWarning, setShowSpectatorWarning] = useState(false);

    const onLeaveClick = useCallback(() => {
        if (mustConfirmLeave(currentGame, user)) {
            onPress(true);

            return;
        }

        onPress(false);
        dispatch(sendLeaveGameMessage());
    }, [currentGame, dispatch, onPress, user]);

    const onConcedeClick = useCallback(() => {
        onPress(false);
        dispatch(sendConcedeMessage());
    }, [dispatch, onPress]);

    const contextMenu = useMemo(() => {
        const menuOptions = [];
        const menuItemClass =
            'cursor-pointer text-base font-medium text-white transition-colors duration-500 ease-in-out hover:text-gray-500 text-nowrap';
        if (currentGame?.started) {
            menuOptions.unshift(
                <button type='button' onClick={onLeaveClick} className={menuItemClass}>
                    Leave Game
                </button>
            );
            if (currentGame.players[user?.username]) {
                menuOptions.unshift(
                    <button type='button' onClick={onConcedeClick} className={menuItemClass}>
                        Concede
                    </button>
                );
            }
            const spectators =
                currentGame.spectators.length > 0 ? (
                    <ul>
                        {currentGame.spectators.map((spectator) => (
                            <li key={spectator.id}>{spectator.name}</li>
                        ))}
                    </ul>
                ) : (
                    <ul>
                        <i>None</i>
                    </ul>
                );

            // If the current user is a player and the number of spectators changed, then display a warning next to the Spectators popup in the navbar
            if (
                currentGame.players[user?.username] &&
                currentGame.spectators.length !== lastSpectatorCount
            ) {
                setShowSpectatorWarning(true);
            }

            menuOptions.unshift(
                <Tooltip delay={0} closeDelay={0}>
                    <Tooltip.Trigger>
                        <button
                            type='button'
                            className={menuItemClass}
                            onMouseOver={() => setShowSpectatorWarning(false)}
                        >
                            {showSpectatorWarning ? <FontAwesomeIcon icon={faWarning} /> : null}{' '}
                            {'Spectators: ' + currentGame.spectators.length}
                        </button>
                    </Tooltip.Trigger>
                    <Tooltip.Content>{spectators}</Tooltip.Content>
                </Tooltip>
            );

            setLastSpectatorCount(currentGame.spectators.length);
        }

        return menuOptions.map((menuItem, index) => {
            return (
                <div key={index} className='flex items-center'>
                    {menuItem}
                </div>
            );
        });
    }, [
        currentGame?.players,
        currentGame?.spectators,
        currentGame?.started,
        lastSpectatorCount,
        onConcedeClick,
        onLeaveClick,
        showSpectatorWarning,
        user?.username
    ]);

    return contextMenu;
};

export default ContextMenu;
