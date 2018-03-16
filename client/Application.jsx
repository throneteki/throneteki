import React from 'react';
import PropTypes from 'prop-types';
import $ from 'jquery';
import { connect } from 'react-redux';

import NavBar from './NavBar';
import Router from './Router';
import * as actions from './actions';

class Application extends React.Component {
    constructor(props) {
        super(props);

        this.router = new Router();
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

    render() {
        let gameBoardVisible = this.props.currentGame && this.props.currentGame.started;

        let component = this.router.resolvePath({
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
