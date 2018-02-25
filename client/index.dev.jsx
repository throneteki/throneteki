import React from 'react';
import ReactDOM from 'react-dom';
import { Provider } from 'react-redux';
import configureStore from './configureStore';
import { navigate } from './actions';
import 'bootstrap/dist/js/bootstrap';
import ReduxToastr from 'react-redux-toastr';
import { AppContainer } from 'react-hot-loader';

const store = configureStore();

store.dispatch(navigate(window.location.pathname, window.location.search));

window.onpopstate = function(e) {
    store.dispatch(navigate(e.target.location.pathname));
};

const render = () => {
    const Application = require('./Application.jsx').default;
    ReactDOM.render(<AppContainer>
        <Provider store={ store }>
            <div className='body'>
                <ReduxToastr
                    timeOut={ 4000 }
                    newestOnTop
                    preventDuplicates
                    position='top-right'
                    transitionIn='fadeIn'
                    transitionOut='fadeOut' />
                <Application />
            </div>
        </Provider>
    </AppContainer>, document.getElementById('component'));
};

if(module.hot) {
    module.hot.accept('./Application.jsx', () => {
        setTimeout(render);
    });
}

render();
