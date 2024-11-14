import React, { useCallback, useMemo, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { sendConcedeMessage, sendLeaveGameMessage } from '../../redux/reducers/game';
import { Link, NavbarMenuItem, Tooltip } from '@nextui-org/react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faWarning } from '@fortawesome/free-solid-svg-icons';
import ConfirmDialog from '../Site/ConfirmDialog';

const ContextMenu = () => {
    const dispatch = useDispatch();
    const { currentGame } = useSelector((state) => state.lobby);
    const { user } = useSelector((state) => state.auth);

    const [lastSpectatorCount, setLastSpectatorCount] = useState(0);
    const [showSpectatorWarning, setShowSpectatorWarning] = useState(false);
    const [showConfirm, setShowConfirm] = useState(false);

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
            setShowConfirm(true);

            return;
        }

        dispatch(sendLeaveGameMessage());
    }, [dispatch, isGameActive, spectating]);

    const contextMenu = useMemo(() => {
        const menuOptions = [];
        const menuItemClass =
            'cursor-pointer text-medium font-[PoppinsMedium] text-white transition-colors duration-500 ease-in-out hover:text-gray-500 text-nowrap';
        if (currentGame?.started) {
            menuOptions.push(
                <Link onPress={onLeaveClick} className={menuItemClass}>
                    Leave Game
                </Link>
            );
            if (currentGame.players[user.username]) {
                menuOptions.unshift(
                    <Link onPress={() => dispatch(sendConcedeMessage())} className={menuItemClass}>
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
                currentGame.players[user.username] &&
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
                <>
                    <NavbarMenuItem key={index}>{menuItem}</NavbarMenuItem>{' '}
                    <ConfirmDialog
                        isOpen={showConfirm}
                        message='Your game is not finished, are you sure you want to leave?'
                        onOpenChange={setShowConfirm}
                        onCancel={() => setShowConfirm(false)}
                        onOk={async () => {
                            dispatch(sendLeaveGameMessage());
                        }}
                    />
                </>
            );
        });
    }, [
        currentGame?.players,
        currentGame?.spectators,
        currentGame?.started,
        dispatch,
        lastSpectatorCount,
        onLeaveClick,
        showConfirm,
        showSpectatorWarning,
        user?.username
    ]);

    return contextMenu;
};

export default ContextMenu;
