import React from 'react';
import PropTypes from 'prop-types';
import $ from 'jquery';
import { connect } from 'react-redux';
import toRegex from 'path-to-regexp';
import queryString from 'query-string';

import NavBar from './NavBar';
import NotFound from './NotFound';
import Unauthorised from './Unauthorised';
import routes from './routes';
import * as actions from './actions';

class Application extends React.Component {
    componentWillMount() {
        let token = localStorage.getItem('token');
        let refreshToken = localStorage.getItem('refreshToken');
        if(refreshToken) {
            this.props.setAuthTokens(token, JSON.parse(refreshToken));

            this.props.authenticate();
        }

        this.props.loadCards();
        this.props.loadPacks();
        this.props.loadFactions();

        $(document).ajaxError((event, xhr) => {
            if(xhr.status === 403) {
                this.props.navigate('/unauth');
            }
        });

        this.props.connectLobby();
    }

    componentDidUpdate() {
        if(!this.props.currentGame) {
            this.props.setContextMenu([]);
        }
    }

    matchUri(path, uri) {
        const keys = [];
        const pattern = toRegex(path, keys);
        const match = pattern.exec(uri);

        if(!match) {
            return undefined;
        }

        let params = {};

        for(let i = 1; i < match.length; i++) {
            params[keys[i - 1].name] = match[i] !== undefined ? match[i] : undefined;
        }

        let parsedString = queryString.parse(location.search);

        params = Object.assign(params, parsedString);

        return params;
    }

    resolvePath(routes, context) {
        for(const route of routes) {
            const uri = context.error ? '/error' : context.pathname;
            const params = this.matchUri(route.path, uri);

            if(!params) {
                continue;
            }

            const result = route.action({ ...context, params });

            if(!result) {
                continue;
            }

            if(route.permission && (!context.user || !context.user.permissions[route.permission])) {
                return <Unauthorised />;
            }

            return result;
        }

        return <NotFound />;
    }

    render() {
        let gameBoardVisible = this.props.currentGame && this.props.currentGame.started;

        let component = this.resolvePath(routes, {
            pathname: this.props.path,
            user: this.props.user,
            currentGame: this.props.currentGame
        });

        let backgroundClass = 'bg';
        if(gameBoardVisible && this.props.user) {
            switch(this.props.user.settings.background) {
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

        return (<div className={ backgroundClass }>
            <NavBar title='The Iron Throne' />
            <div className='wrapper'>
                <div className='container content'>
                    { component }
                </div>
            </div>
        </div>);
    }
}

Application.displayName = 'Application';
Application.propTypes = {
    authenticate: PropTypes.func,
    connectLobby: PropTypes.func,
    currentGame: PropTypes.object,
    loadCards: PropTypes.func,
    loadFactions: PropTypes.func,
    loadPacks: PropTypes.func,
    navigate: PropTypes.func,
    path: PropTypes.string,
    setAuthTokens: PropTypes.func,
    setContextMenu: PropTypes.func,
    token: PropTypes.string,
    user: PropTypes.object
};

function mapStateToProps(state) {
    return {
        currentGame: state.lobby.currentGame,
        path: state.navigation.path,
        token: state.account.token,
        user: state.account.user
    };
}


export default connect(mapStateToProps, actions)(Application);
