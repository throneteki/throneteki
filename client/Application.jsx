import React, { useState, useEffect, useRef } from 'react';
import $ from 'jquery';
import { useDispatch, useSelector } from 'react-redux';
import * as Sentry from '@sentry/react';
import NavBar from './Components/Navigation/NavBar';
import Router from './Router';
import { tryParseJSON } from './util';
import AlertPanel from './Components/Site/AlertPanel';
import { useVerifyAuthenticationQuery } from './redux/middleware/api';
import { setAuthTokens, setUser } from './redux/reducers/auth';
import { startConnecting } from './redux/reducers/lobby';
import { navigate } from './redux/reducers/navigation';
import Background from './assets/img/bgs/mainbg.png';
import BlankBg from './assets/img/bgs/blank.png';
import StandardBg from './assets/img/bgs/background.png';
import WinterBg from './assets/img/bgs/background2.png';
import LoadingSpinner from './Components/Site/LoadingSpinner';
import CardHover from './Components/Images/CardHover';
import ErrorMessage from './Components/Site/ErrorMessage';
import classNames from 'classnames';

const backgrounds = {
    none: BlankBg,
    BG1: StandardBg,
    BG2: WinterBg
};

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

    const gameBoardVisible = currentGame && currentGame.started;

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

    useEffect(() => {
        if (gameBoardVisible && user) {
            const settings = user.settings;
            const background = settings.background;

            if (bgRef.current && background === 'custom' && settings.customBackgroundUrl) {
                bgRef.current.style.backgroundImage = `url('/img/bgs/${settings.customBackgroundUrl}')`;
            } else if (bgRef.current) {
                bgRef.current.style.backgroundImage = `url('${backgrounds[background]}')`;
            }
        } else if (bgRef.current) {
            bgRef.current.style.backgroundImage = `url('${Background}')`;
        }
    }, [gameBoardVisible, user]);

    const containerClass = classNames('container h-full', {
        'max-w-full': gameBoardVisible
    });
    return (
        <div className='flex flex-col h-screen'>
            <NavBar />
            <main role='main' className='flex-1 overflow-y-auto'>
                <div className='bg-cover bg-center bg-no-repeat h-full' ref={bgRef}>
                    <Sentry.ErrorBoundary
                        fallback={
                            <ErrorMessage
                                title='Unexpected Error'
                                message='Report has been automatically submitted'
                            />
                        }
                    >
                        <CardHover className='w-full h-full'>
                            {isLoading ? (
                                <LoadingSpinner size='lg' />
                            ) : (
                                <div className={containerClass}>{component}</div>
                            )}
                        </CardHover>
                    </Sentry.ErrorBoundary>
                </div>
            </main>
        </div>
    );
};

export default Application;
