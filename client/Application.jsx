import React from 'react';
import PropTypes from 'prop-types';
import $ from 'jquery';
import _ from 'underscore';
import { connect } from 'react-redux';
import toRegex from 'path-to-regexp';
import queryString from 'query-string';

import NavBar from './NavBar';
import NotFound from './NotFound';
import Unauthorised from './Unauthorised';
import routes from './routes';

import * as actions from './actions';

class Application extends React.Component {
    constructor(props) {
        super(props);

        this.paths = routes;
    }

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
        let rightMenu;

        if(!this.props.user) {
            rightMenu = [
                { name: 'Login', path: '/login' },
                { name: 'Register', path: '/register' }
            ];
        } else {
            rightMenu = [
                {
                    name: this.props.user.username, childItems: [
                        { name: 'Profile', path: '/profile' },
                        { name: 'Security', path: '/security' },
                        { name: 'Block List', path: '/blocklist' },
                        { name: 'Logout', path: '/logout' }
                    ], avatar: true, emailHash: this.props.user.emailHash, disableGravatar: this.props.user.settings.disableGravatar
                }
            ];
        }

        let leftMenu = [
            { name: 'Decks', path: '/decks' },
            { name: 'Play', path: '/play' },
            {
                name: 'Help', childItems: [
                    { name: 'How To Play', path: '/how-to-play' },
                    { name: 'About', path: '/about' }
                ]
            }
        ];

        let adminMenuItems = [];
        let permissions = {};

        if(this.props.user && this.props.user.permissions) {
            permissions = this.props.user.permissions;

            if(permissions.canEditNews) {
                adminMenuItems.push({ name: 'News', path: '/news' });
            }

            if(permissions.canManageUsers) {
                adminMenuItems.push({ name: 'Users', path: '/users' });
            }
        }

        if(_.size(adminMenuItems) > 0) {
            leftMenu.push({ name: 'Admin', childItems: adminMenuItems });
        }

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
            <NavBar leftMenu={ leftMenu } rightMenu={ rightMenu } title='The Iron Throne' currentPath={ this.props.path } numGames={ this.props.games.length } />
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
    dispatch: PropTypes.func,
    games: PropTypes.array,
    loadCards: PropTypes.func,
    loadFactions: PropTypes.func,
    loadPacks: PropTypes.func,
    loggedIn: PropTypes.bool,
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
        games: state.lobby.games,
        path: state.navigation.path,
        loggedIn: state.account.loggedIn,
        token: state.account.token,
        user: state.account.user
    };
}


export default connect(mapStateToProps, actions)(Application);
