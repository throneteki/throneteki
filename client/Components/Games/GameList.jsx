import React, { useCallback, useMemo } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { toastr } from 'react-redux-toastr';

import AlertPanel from '../Site/AlertPanel';
import Game from './Game';
import {
    joinPasswordGame,
    sendJoinGameMessage,
    sendRemoveGameMessage,
    sendWatchGameMessage
} from '../../redux/reducers/lobby';

const GameList = ({ gameFilter }) => {
    const dispatch = useDispatch();
    const currentGame = useSelector((state) => state.lobby.currentGame);
    const user = useSelector((state) => state.auth.user);
    const games = useSelector((state) => state.lobby.games);

    const joinGame = useCallback(
        (game) => {
            if (!user) {
                toastr.error('Please login before trying to join a game');
                return;
            }

            if (game.needsPassword) {
                dispatch(joinPasswordGame(game, 'Join'));
            } else {
                dispatch(sendJoinGameMessage(game.id));
            }
        },
        [user, dispatch]
    );

    const canWatch = useCallback(
        (game) => {
            return !currentGame && game.allowSpectators;
        },
        [currentGame]
    );

    const watchGame = useCallback(
        (game) => {
            if (!user) {
                toastr.error('Please login before trying to watch a game');
                return;
            }

            if (game.needsPassword) {
                dispatch(joinPasswordGame(game, 'Watch'));
            } else {
                dispatch(sendWatchGameMessage(game.id));
            }
        },
        [user, dispatch]
    );

    const removeGame = useCallback(
        (game) => {
            dispatch(sendRemoveGameMessage(game.id));
        },
        [dispatch]
    );

    const canJoin = useCallback(
        (game) => {
            if (currentGame || game.started || game.full) {
                return false;
            }

            return true;
        },
        [currentGame]
    );

    const gameList = useMemo(() => {
        let gamesToReturn = [];

        let isAdmin = user && user.permissions.canManageGames;

        // Orders games by whether they've started, followed by the time it was created (earliest first)
        const compareGames = (a, b) => {
            if (!a.started && b.started) {
                return -1;
            }
            if (a.started && !b.started) {
                return 1;
            }
            return a.createdAt - b.createdAt;
        };

        for (const game of [...games].sort((a, b) => compareGames(a, b))) {
            if (gameFilter.showOnlyNewGames && game.started) {
                continue;
            }

            if (!gameFilter[game.gameType]) {
                continue;
            }

            if (!game.started && game.gamePrivate && !isAdmin) {
                continue;
            }

            gamesToReturn.push(
                <Game
                    key={game.id}
                    game={game}
                    showJoinButton={canJoin(game)}
                    showWatchButton={canWatch(game)}
                    onJoinGame={() => joinGame(game)}
                    onRemoveGame={() => removeGame(game)}
                    onWatchGame={() => watchGame(game)}
                    isAdmin={isAdmin}
                />
            );
        }

        return <div>{gamesToReturn}</div>;
    }, [user, games, gameFilter, canJoin, canWatch, joinGame, removeGame, watchGame]);

    if (gameList.length === 0) {
        return (
            <div>
                <AlertPanel
                    variant='info'
                    message='There are no games matching the filters you have selected'
                />
            </div>
        );
    }

    return <div>{gameList}</div>;
};

export default GameList;
