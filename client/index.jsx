import React from 'react';
import $ from 'jquery';
import { render } from 'react-dom';
import { Provider } from 'react-redux';
import Application from './Application';
import 'jquery-validation';
import 'jquery-validation-unobtrusive';
import 'react-redux-toastr/src/styles/index.scss';
import 'react-bootstrap-typeahead/css/Typeahead.css';
import ReduxToastr from 'react-redux-toastr';
import * as Sentry from '@sentry/browser';
import 'core-js/stable';
import 'regenerator-runtime/runtime';
import { DragDropContext } from 'react-dnd';
import { default as TouchBackend } from 'react-dnd-touch-backend';
import configureStore from './configureStore';
import { navigate } from './actions';
import './less/site.less';

window.jQuery = window.$ = $;

$.validator.setDefaults({
    highlight: function (element) {
        $(element).closest('.form-group').addClass('has-error');
    },
    unhighlight: function (element) {
        $(element).closest('.form-group').removeClass('has-error');
    }
});

import ErrorBoundary from './Components/Site/ErrorBoundary';

const sentryOptions = {
    dsn: 'https://f5286cd580bf46898e7180c7a46de2f6@o57348.ingest.us.sentry.io/123019',
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
    release: import.meta.env.VERSION || 'Local build',
    includeLocalVariables: true
};

Sentry.init(sentryOptions);

const store = configureStore();

store.dispatch(navigate(window.location.pathname, window.location.search));

window.onpopstate = function (e) {
    store.dispatch(navigate(e.target.location.pathname));
};

const DnDContainer = DragDropContext(TouchBackend({ enableMouseEvents: true }))(Application);

render(
    <Provider store={store}>
        <div className='body'>
            <ReduxToastr
                timeOut={4000}
                newestOnTop
                preventDuplicates
                position='top-right'
                transitionIn='fadeIn'
                transitionOut='fadeOut'
            />
            <ErrorBoundary
                message={
                    "We're sorry, a critical error has occured in the client and we're unable to show you anything.  Please try refreshing your browser after filling out a report."
                }
            >
                <DnDContainer />
            </ErrorBoundary>
        </div>
    </Provider>,
    document.getElementById('root')
);
