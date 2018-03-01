import React from 'react';
import PropTypes from 'prop-types';
import $ from 'jquery';
import _ from 'underscore';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';

import Login from './pages/Login';
import Logout from './Logout.jsx';
import Register from './pages/Register';
import Lobby from './pages/Lobby.jsx';
import Decks from './Decks.jsx';
import AddDeck from './AddDeck.jsx';
import EditDeck from './EditDeck.jsx';
import NotFound from './NotFound.jsx';
import NavBar from './NavBar.jsx';
import GameLobby from './GameLobby.jsx';
import GameBoard from './GameBoard.jsx';
import HowToPlay from './HowToPlay.jsx';
import About from './About.jsx';
import ForgotPassword from './pages/ForgotPassword.jsx';
import ResetPassword from './pages/ResetPassword.jsx';
import Profile from './Profile.jsx';
import NewsAdmin from './NewsAdmin.jsx';
import Unauthorised from './Unauthorised.jsx';
import UserAdmin from './UserAdmin.jsx';
import BlockList from './BlockList.jsx';
import Activation from './pages/Activation.jsx';

import * as actions from './actions';

class App extends React.Component {
    constructor(props) {
        super(props);

        let boundActionCreators = bindActionCreators(actions, this.props.dispatch);

        this.paths = {
            '/': () => <Lobby />,
            '/login': () => <Login />,
            '/register': () => <Register />,
            '/decks': () => <Decks { ...boundActionCreators } />,
            '/decks/add': () => <AddDeck />,
            '/decks/edit': params => <EditDeck deckId={ params.deckId } />,
            '/play': () => (this.props.currentGame && this.props.currentGame.started) ? <GameBoard /> : <GameLobby />,
            '/how-to-play': () => <HowToPlay />,
            '/about': () => <About />,
            '/forgot': () => <ForgotPassword />,
            '/reset-password': params => <ResetPassword id={ params.id } token={ params.token } />,
            '/profile': () => <Profile />,
            '/news': () => <NewsAdmin />,
            '/activation': () => params => <Activation id={ params.id } token={ params.token } />
        };
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

    getUrlParameter(name) {
        name = name.replace(/[[]/, '\\[').replace(/[\]]/, '\\]');
        let regex = new RegExp('[\\?&]' + name + '=([^&#]*)');
        let results = regex.exec(location.search);

        return results === null ? '' : decodeURIComponent(results[1].replace(/\+/g, ' '));
    }

    isNumeric(n) {
        return !isNaN(parseFloat(n)) && isFinite(n);
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

        let component = {};

        let path = this.props.path;
        let argIndex = path.lastIndexOf('/');
        let arg;

        let page = this.paths[path];
        if(!page) {
            if(argIndex !== -1 && argIndex !== 0) {
                arg = path.substring(argIndex + 1);
                path = path.substring(0, argIndex);
            }

            let page = this.paths[path];
            if(!page) {
                page = this.paths[this.props.path];
                arg = undefined;
            }
        }

        let idArg;
        let tokenArg;
        let index;
        let gameBoardVisible = false;

        index = path.indexOf('/reset-password');
        if(index !== -1) {
            idArg = this.getUrlParameter('id');
            tokenArg = this.getUrlParameter('token');
        }
        index = path.indexOf('/activation');
        if(index !== -1) {
            idArg = this.getUrlParameter('id');
            tokenArg = this.getUrlParameter('token');
        }

        let boundActionCreators = bindActionCreators(actions, this.props.dispatch);

        switch(path) {
            case '/':
                component = <Lobby />;
                break;
            case '/login':
                component = <Login />;
                break;
            case '/logout':
                component = <Logout />;
                break;
            case '/register':
                component = <Register />;
                break;
            case '/decks':
                component = <Decks { ...boundActionCreators } />;
                break;
            case '/decks/add':
                component = <AddDeck />;
                break;
            case '/decks/edit':
                component = <EditDeck deckId={ arg } />;
                break;
            case '/play':
                if(this.props.currentGame && this.props.currentGame.started) {
                    component = <GameBoard />;
                    gameBoardVisible = true;
                } else {
                    component = <GameLobby />;
                }

                break;
            case '/how-to-play':
                component = <HowToPlay />;
                break;
            case '/about':
                component = <About />;
                break;
            case '/forgot':
                component = <ForgotPassword />;
                break;
            case '/reset-password':
                component = <ResetPassword id={ idArg } token={ tokenArg } />;
                break;
            case '/profile':
                component = <Profile />;
                break;
            case '/news':
                if(!permissions.canEditNews) {
                    component = <Unauthorised />;
                } else {
                    component = <NewsAdmin />;
                }

                break;
            case '/unauth':
                component = <Unauthorised />;
                break;
            case '/users':
                if(!permissions.canManageUsers) {
                    component = <Unauthorised />;
                } else {
                    component = <UserAdmin />;
                }

                break;
            case '/blocklist':
                component = <BlockList />;
                break;
            case '/activation':
                component = <Activation id={ idArg } token={ tokenArg } />;
                break;
            default:
                component = <NotFound />;
                break;
        }

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

App.displayName = 'Application';
App.propTypes = {
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
    user: PropTypes.object,
    username: PropTypes.string
};

function mapStateToProps(state) {
    return {
        currentGame: state.lobby.currentGame,
        games: state.lobby.games,
        path: state.navigation.path,
        loggedIn: state.account.loggedIn,
        token: state.account.token,
        user: state.account.user,
        username: state.account.user ? state.account.user.username : undefined
    };
}

function mapDispatchToProps(dispatch) {
    let boundActions = bindActionCreators(actions, dispatch);
    boundActions.dispatch = dispatch;

    return boundActions;
}

const Application = connect(mapStateToProps, mapDispatchToProps)(App);

export default Application;
