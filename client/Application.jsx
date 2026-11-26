import React, { useState, useEffect, useRef } from 'react';
import $ from 'jquery';
import { useDispatch, useSelector } from 'react-redux';
import * as Sentry from '@sentry/react';
import NavBar from './Components/Navigation/NavBar';
import Router from './Router';
import { tryParseJSON } from './util';
import Notice from './Components/Site/Notice';
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
import { customBackgroundUrl } from './util';
import { builtInBackgroundUrl } from './backgrounds';

const Application = () => {
    const router = new Router();
    const dispatch = useDispatch();
    const currentGame = useSelector((state) => state.lobby.currentGame);
    const path = useSelector((state) => state.navigation.path);
    const { user, token, refreshToken } = useSelector((state) => state.auth);
    const bgRef = useRef();

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
            <Notice kind='error' isBoxed className='mx-auto mt-10 max-w-xl'>
                Your browser can’t run this site. Please update it: the site works best with a
                recent version of Chrome, Safari or Firefox.
            </Notice>
        );
    } else if (cannotLoad) {
        component = (
            <Notice kind='error' isBoxed className='mx-auto mt-10 max-w-xl'>
                This site needs cookies and local site data to work. Please allow them for this
                site.
            </Notice>
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

    const containerClass = classNames('container h-full relative z-0', {
        'max-w-full': gameBoardVisible
    });
    return (
        <>
            <NavBar />
            <main role='main'>
                <div
                    className='absolute bottom-0 left-0 right-0 top-[3rem] bg-cover bg-center bg-no-repeat overflow-y-auto'
                    ref={bgRef}
                >
                    <Sentry.ErrorBoundary
                        fallback={
                            <ErrorMessage
                                title='Unexpected Error'
                                message='Report has been automatically submitted'
                            />
                        }
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
