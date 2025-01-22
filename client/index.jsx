import React from 'react';
import $ from 'jquery';
import { Provider } from 'react-redux';
import Application from './Application';
import 'jquery-validation';
import 'jquery-validation-unobtrusive';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import * as Sentry from '@sentry/browser';
import * as SentryReact from '@sentry/react';
import { createRoot } from 'react-dom/client';
import { HeroUIProvider } from "@heroui/react";
import { ThemeProvider as NextThemesProvider } from 'next-themes';

import { store } from './configureStore';
import { navigate } from './redux/reducers/navigation';

import './index.css';

$.validator.setDefaults({
    highlight: function (element) {
        $(element).closest('.form-group').addClass('has-error');
    },
    unhighlight: function (element) {
        $(element).closest('.form-group').removeClass('has-error');
    }
});

const sentryOptions = {
    dsn: import.meta.env.VITE_SENTRY_KEY,
    denyUrls: [
        // Facebook flakiness
        /graph\.facebook\.com/i,
        // Facebook blocked
        /connect\.facebook\.net\/en_US\/all\.js/i,
        // Woopra flakiness
        /eatdifferent\.com\.woopra-ns\.com/i,
        /static\.woopra\.com\/js\/woopra\.js/i,
        // Chrome extensions
        /extensions\//i,
        /^chrome:\/\//i,
        /chrome-extension:/i,
        // Other plugins
        /127\.0\.0\.1:4001\/isrunning/i, // Cacaoweb
        /webappstoolbarba\.texthelp\.com\//i,
        /metrics\.itunes\.apple\.com\.edgesuite\.net\//i,
        /YoukuAntiAds\.eval/i
    ],
    beforeSend(event, hint) {
        if (
            event.message &&
            event.message.startsWith('Non-Error exception captured') &&
            hint.originalException.error
        ) {
            Sentry.withScope((scope) => {
                scope.setExtra('nonErrorException', true);
                Sentry.captureException(hint.originalException.error);
            });
            return null;
        }

        return event;
    },
    release: import.meta.env.VITE_VERSION || 'Local build',
    includeLocalVariables: true
};

if (import.meta.env.VITE_SENTRY_KEY) {
    Sentry.init(sentryOptions);
}

store.dispatch(navigate(window.location.pathname, window.location.search));

window.onpopstate = function (e) {
    store.dispatch(navigate(e.target.location.pathname));
};

const container = document.getElementById('component');
const root = createRoot(container);

root.render(
    <Provider store={store}>
        <HeroUIProvider>
            <NextThemesProvider attribute='class' defaultTheme='dark'>
                <div className='body'>
                    <ToastContainer
                        position='top-right'
                        autoClose={5000}
                        newestOnTop={false}
                        closeOnClick
                        pauseOnHover
                    />
                    <SentryReact.ErrorBoundary fallback={<p>An error has occurred</p>}>
                        <Application />
                    </SentryReact.ErrorBoundary>
                </div>
            </NextThemesProvider>
        </HeroUIProvider>
    </Provider>
);
