import React, { useCallback, useMemo, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { toastr } from 'react-redux-toastr';
import { sendConcedeMessage, sendLeaveGameMessage } from '../../redux/reducers/game';

const ContextMenu = () => {
    const dispatch = useDispatch();
    const { currentGame } = useSelector((state) => state.lobby);
    const { user } = useSelector((state) => state.auth);

    const [showPopup, setShowPopup] = useState(undefined);
    const [lastSpectatorCount, setLastSpectatorCount] = useState(0);
    const [showSpectatorWarning, setShowSpectatorWarning] = useState(false);

    let spectating = currentGame && !currentGame.players[user.username];

    const onMenuItemMouseOver = useCallback((menuItem) => {
        setShowPopup(menuItem);

        if (menuItem.onMouseOver) {
            menuItem.onMouseOver();
        }
    }, []);

    const onMenuItemMouseOut = useCallback(() => {
        setShowPopup(undefined);
    }, []);

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

    let contextMenu = useMemo(() => {
        let menuOptions = [];

        if (currentGame?.started) {
            menuOptions.push({ text: 'Leave Game', onClick: onLeaveClick });
            if (currentGame.players[user.username]) {
                menuOptions.unshift({
                    text: 'Concede',
                    onClick: () => dispatch(sendConcedeMessage())
                });
            }

            let spectators = currentGame.spectators.map((spectator) => {
                return <li key={spectator.id}>{spectator.name}</li>;
            });

            let spectatorPopup = <ul className='spectators-popup absolute-panel'>{spectators}</ul>;

            //if the current user is a player and the number of spectators changed, then display a warning next to the Spectators popup in the navbar
            if (
                currentGame.players[user.username] &&
                currentGame.spectators.length !== lastSpectatorCount
            ) {
                setShowSpectatorWarning(true);
            }

            menuOptions.unshift({
                text: 'Spectators: ' + currentGame.spectators.length,
                popup: spectatorPopup,
                displayWarning: showSpectatorWarning,
                onMouseOver: () => setShowSpectatorWarning(false)
            });

            setLastSpectatorCount(currentGame.spectators.length);
        }

        return menuOptions.map((menuItem) => {
            return (
                <li key={menuItem.text}>
                    <a
                        className='cursor-pointer font-[PoppinsMedium]'
                        onMouseOver={() => onMenuItemMouseOver(menuItem)}
                        onMouseOut={() => onMenuItemMouseOut()}
                        onClick={
                            menuItem.onClick
                                ? (event) => {
                                      event.preventDefault();
                                      menuItem.onClick();
                                  }
                                : null
                        }
                    >
                        {' '}
                        {menuItem.displayWarning ? <span className='warning-icon' /> : null}{' '}
                        {menuItem.text}
                    </a>
                    {showPopup?.text === menuItem.text ? showPopup.popup : null}
                </li>
            );
        });
    }, [
        currentGame?.players,
        currentGame?.spectators,
        currentGame?.started,
        dispatch,
        lastSpectatorCount,
        onLeaveClick,
        onMenuItemMouseOut,
        onMenuItemMouseOver,
        showPopup,
        showSpectatorWarning,
        user?.username
    ]);

    return contextMenu;
};

export default ContextMenu;
