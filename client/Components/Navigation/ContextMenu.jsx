import React, { useCallback, useMemo, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { sendConcedeMessage, sendLeaveGameMessage } from '../../redux/reducers/game';
import { Link, NavbarMenuItem, Tooltip } from '@heroui/react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faWarning } from '@fortawesome/free-solid-svg-icons';

const ContextMenu = ({ onPress = () => true }) => {
    const dispatch = useDispatch();
    const { currentGame } = useSelector((state) => state.lobby);
    const { user } = useSelector((state) => state.auth);

    const [lastSpectatorCount, setLastSpectatorCount] = useState(0);
    const [showSpectatorWarning, setShowSpectatorWarning] = useState(false);

    const onLeaveClick = useCallback(() => {
        const all = { ...currentGame.players, ...currentGame.spectators };
        if (user && !all[user.username].canSafelyLeave) {
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
            'cursor-pointer text-medium font-[PoppinsMedium] text-white transition-colors duration-500 ease-in-out hover:text-gray-500 text-nowrap';
        if (currentGame?.started) {
            menuOptions.unshift(
                <Link onPress={onLeaveClick} className={menuItemClass}>
                    Leave Game
                </Link>
            );
            if (currentGame.players[user?.username]) {
                menuOptions.unshift(
                    <Link onPress={onConcedeClick} className={menuItemClass}>
                        Concede
                    </Link>
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
                <Tooltip content={spectators} closeDelay={0}>
                    <a className={menuItemClass} onMouseOver={() => setShowSpectatorWarning(false)}>
                        {showSpectatorWarning ? <FontAwesomeIcon icon={faWarning} /> : null}{' '}
                        {'Spectators: ' + currentGame.spectators.length}
                    </a>
                </Tooltip>
            );

            setLastSpectatorCount(currentGame.spectators.length);
        }

        return menuOptions.map((menuItem, index) => {
            return (
                <div key={index}>
                    <NavbarMenuItem>{menuItem}</NavbarMenuItem>{' '}
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
