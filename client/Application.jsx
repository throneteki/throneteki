import React, { useState, useEffect, useRef } from 'react';
import $ from 'jquery';
import { useDispatch, useSelector } from 'react-redux';
import * as Sentry from '@sentry/react';
import NavBar from './Components/Navigation/NavBar';
import BoardNavBar from './Components/Navigation/BoardNavBar';
import Router from './Router';
import { tryParseJSON } from './util';
import AlertPanel from './Components/Site/AlertPanel';
import { useVerifyAuthenticationQuery } from './redux/middleware/api';
import { setAuthTokens, setUser } from './redux/reducers/auth';
import { startConnecting } from './redux/reducers/lobby';
import { navigate } from './redux/reducers/navigation';
import Background from './assets/img/bgs/mainbg.webp';
import LoadingSpinner from './Components/Site/LoadingSpinner';
import CardHover from './Components/Images/CardHover';
import ErrorMessage from './Components/Site/ErrorMessage';
import classNames from 'classnames';
import PendingGameAlerter from './Components/Games/PendingGameAlerter';
import { hidesNavbar, useAdaptiveLayoutMode } from './boardLayoutStore';
import { customBackgroundUrl } from './util';
import { builtInBackgroundUrl } from './backgrounds';

const Application = () => {
    const router = new Router();
    const dispatch = useDispatch();
    const currentGame = useSelector((state) => state.lobby.currentGame);
    const path = useSelector((state) => state.navigation.path);
    const { user, token, refreshToken } = useSelector((state) => state.auth);
    const bgRef = useRef();
    const adaptiveLayoutMode = useAdaptiveLayoutMode();

    const [incompatibleBrowser, setIncompatibleBrowser] = useState(false);
    const [cannotLoad, setCannotLoad] = useState(false);

    const { isLoading, data } = useVerifyAuthenticationQuery('', {
        skip: !token || !refreshToken
    });

    useEffect(() => {
        if (!localStorage) {
            setIncompatibleBrowser(true);
        } else {
            try {
                let token = localStorage.getItem('token');
                let refreshToken = localStorage.getItem('refreshToken');
                if (refreshToken) {
                    const parsedToken = tryParseJSON(refreshToken);
                    if (parsedToken) {
                        dispatch(setAuthTokens(token, parsedToken));
                    }
                }
            } catch (error) {
                setCannotLoad(true);
            }
        }

        $(document).ajaxError((event, xhr) => {
            if (xhr.status === 403) {
                dispatch(navigate('/unauth'));
            }
        });

        dispatch(startConnecting());
    }, [dispatch]);

    useEffect(() => {
        if (data) {
            dispatch(setUser(data));
        }
    }, [data, dispatch]);

    // Scenario games are created by the game node rather than from the lobby, so nothing else
    // takes the players to the board.
    useEffect(() => {
        if (currentGame?.scenario && path !== '/play') {
            dispatch(navigate('/play'));
        }
    }, [currentGame, dispatch, path]);

    let component = router.resolvePath({
        pathname: path,
        user: user,
        currentGame: currentGame
    });

    if (incompatibleBrowser) {
        component = (
            <AlertPanel
                variant='danger'
                message='Your browser does not provide the required functionality for this site to work. Please upgrade your browser. The site works best with a recet version of Chrome, Safari or Firefox.'
            />
        );
    } else if (cannotLoad) {
        component = (
            <AlertPanel
                variant='danger'
                message='This site requires the ability to store cookies and local site data to function. Please enable these features to use the site.'
            />
        );
    }

    const gameBoardVisible = currentGame && currentGame.started && component.key === 'gameboard';
    useEffect(() => {
        if (gameBoardVisible && user) {
            const background = user.settings?.background;

            if (bgRef.current && background === 'custom' && user.customBackground) {
                bgRef.current.style.backgroundImage = `url('${customBackgroundUrl(user.customBackground)}')`;
            } else if (bgRef.current) {
                bgRef.current.style.backgroundImage = `url('${builtInBackgroundUrl(background)}')`;
            }
        } else if (bgRef.current) {
            bgRef.current.style.backgroundImage = `url('${Background}')`;
        }
    }, [gameBoardVisible, user]);

    // On a phone the adaptive board takes the whole screen, and the navbar shows over it with the game menu
    const fullScreenBoard = hidesNavbar(adaptiveLayoutMode);
    const containerClass = classNames('container h-full relative z-0', {
        'max-w-full': gameBoardVisible || fullScreenBoard || component.key === 'devboard'
    });
    return (
        <>
            {fullScreenBoard ? <BoardNavBar /> : <NavBar />}
            <main role='main'>
                <div
                    // On a phone the board is pinned to the edges of what is visible, so the browser sizes it as its
                    // toolbars come and go (a height in dvh can come out short of the screen on Android). While the
                    // chat is typed into it keeps its height instead (--board-height), under the keyboard.
                    className={classNames(
                        'left-0 right-0 bg-cover bg-center bg-no-repeat',
                        fullScreenBoard
                            ? 'fixed inset-0 h-[var(--board-height,auto)] overflow-hidden'
                            : 'absolute bottom-0 top-[3rem] overflow-y-auto'
                    )}
                    ref={bgRef}
                >
                    <Sentry.ErrorBoundary
                        fallback={({ error, componentStack }) => (
                            <ErrorMessage
                                title='Unexpected Error'
                                message='Report has been automatically submitted'
                                details={
                                    import.meta.env.DEV
                                        ? `${error?.stack || error}\n${componentStack || ''}`
                                        : undefined
                                }
                            />
                        )}
                    >
                        <CardHover>
                            {isLoading ? (
                                <LoadingSpinner size='lg' />
                            ) : (
                                <div className={containerClass}>{component}</div>
                            )}
                        </CardHover>
                        {currentGame?.started === false && (
                            <PendingGameAlerter game={currentGame} user={user} />
                        )}
                    </Sentry.ErrorBoundary>
                </div>
            </main>
        </>
    );
};

export default Application;
