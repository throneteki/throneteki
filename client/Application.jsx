import React, { useState, useEffect } from 'react';
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

const Application = () => {
    const router = new Router();
    const dispatch = useDispatch();
    const currentGame = useSelector((state) => state.lobby.currentGame);
    const path = useSelector((state) => state.navigation.path);
    const { user, token, refreshToken } = useSelector((state) => state.auth);

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

    let gameBoardVisible = currentGame && currentGame.started;

    let component = router.resolvePath({
        pathname: path,
        user: user,
        currentGame: currentGame
    });

    if (incompatibleBrowser) {
        component = (
            <AlertPanel
                type='error'
                message='Your browser does not provide the required functionality for this site to work.  Please upgrade your browser.  The site works best with a recet version of Chrome, Safari or Firefox'
            />
        );
    } else if (cannotLoad) {
        component = (
            <AlertPanel
                type='error'
                message='This site requires the ability to store cookies and local site data to function.  Please enable these features to use the site.'
            />
        );
    }

    let backgroundClass = 'bg';
    if (gameBoardVisible && user) {
        switch (user.settings.background) {
            case 'BG1':
                backgroundClass = 'bg-board';
                break;
            case 'BG2':
                backgroundClass = 'bg-board2';
                break;
            default:
                backgroundClass = '';
                break;
        }
    }

    return (
        <div className={backgroundClass}>
            <NavBar title='The Iron Throne' />
            <div className='wrapper'>
                <div className='container content'>
                    <Sentry.ErrorBoundary fallback={<p>An error has occurred</p>}>
                        {isLoading ? <div>Please wait...</div> : component}
                    </Sentry.ErrorBoundary>
                </div>
            </div>
        </div>
    );
};

export default Application;
