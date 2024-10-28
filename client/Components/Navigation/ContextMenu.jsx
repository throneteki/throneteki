import React, { useCallback, useMemo, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { toastr } from 'react-redux-toastr';
import { sendConcedeMessage, sendLeaveGameMessage } from '../../redux/reducers/game';
import { PopoverContent, PopoverTrigger, Link, NavbarMenuItem } from '@nextui-org/react';
import MouseOverPopover from '../Site/MouseOverPopover';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faWarning } from '@fortawesome/free-solid-svg-icons';

const ContextMenu = () => {
    const dispatch = useDispatch();
    const { currentGame } = useSelector((state) => state.lobby);
    const { user } = useSelector((state) => state.auth);

    const [lastSpectatorCount, setLastSpectatorCount] = useState(0);
    const [showSpectatorWarning, setShowSpectatorWarning] = useState(false);

    let spectating = currentGame && !currentGame.players[user.username];

    const isGameActive = useMemo(() => {
        if (!currentGame || !user) {
            return false;
        }

        if (currentGame.winner) {
            return false;
        }

        let thisPlayer = currentGame.players[user.username];
        if (!thisPlayer) {
            thisPlayer = Object.values(currentGame.players)[0];
        }

        let otherPlayer = Object.values(currentGame.players).find((player) => {
            return player.name !== thisPlayer.name;
        });

        if (!otherPlayer) {
            return false;
        }

        if (otherPlayer.disconnected || otherPlayer.left) {
            return false;
        }

        return true;
    }, [currentGame, user]);

    const onLeaveClick = useCallback(() => {
        if (!spectating && isGameActive) {
            toastr.confirm('Your game is not finished, are you sure you want to leave?', {
                onOk: () => {
                    dispatch(sendLeaveGameMessage());
                }
            });

            return;
        }

        dispatch(sendLeaveGameMessage());
    }, [dispatch, isGameActive, spectating]);

    const contextMenu = useMemo(() => {
        const menuOptions = [];
        const menuItemClass =
            'cursor-pointer text-medium font-[PoppinsMedium] text-white transition-colors duration-500 ease-in-out hover:text-gray-500';
        if (currentGame?.started) {
            menuOptions.push(
                <Link onPress={onLeaveClick}>
                    <a className={menuItemClass}>Leave Game</a>
                </Link>
            );
            if (currentGame.players[user.username]) {
                menuOptions.unshift(
                    <Link onPress={() => dispatch(sendConcedeMessage())}>
                        <a className={menuItemClass}>Concede</a>
                    </Link>
                );
            }
            const spectatorPopover =
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
                currentGame.players[user.username] &&
                currentGame.spectators.length !== lastSpectatorCount
            ) {
                setShowSpectatorWarning(true);
            }

            menuOptions.unshift(
                <MouseOverPopover triggerScaleOnOpen={false}>
                    <PopoverTrigger>
                        <a
                            className={menuItemClass}
                            onMouseOver={() => setShowSpectatorWarning(false)}
                        >
                            {showSpectatorWarning ? <FontAwesomeIcon icon={faWarning} /> : null}{' '}
                            {'Spectators: ' + currentGame.spectators.length}
                        </a>
                    </PopoverTrigger>
                    <PopoverContent>{spectatorPopover}</PopoverContent>
                </MouseOverPopover>
            );

            setLastSpectatorCount(currentGame.spectators.length);
        }

        return menuOptions.map((menuItem, index) => {
            return <NavbarMenuItem key={index}>{menuItem}</NavbarMenuItem>;
        });
    }, [
        currentGame?.players,
        currentGame?.spectators,
        currentGame?.started,
        dispatch,
        lastSpectatorCount,
        onLeaveClick,
        showSpectatorWarning,
        user?.username
    ]);

    return contextMenu;
};

export default ContextMenu;
