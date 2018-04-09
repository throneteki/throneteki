import React from 'react';
import PropTypes from 'prop-types';
import $ from 'jquery';
import { connect } from 'react-redux';
import { CSSTransitionGroup } from 'react-transition-group';

import ErrorBoundary from './Components/Site/ErrorBoundary';
import NavBar from './Components/Site/NavBar';
import Router from './Router';
import {tryParseJSON} from './util';
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
            const parsedToken = tryParseJSON(refreshToken);
            if(parsedToken) {
                this.props.setAuthTokens(token, parsedToken);
                this.props.authenticate();
            }
        }

        this.props.loadCards();
        this.props.loadPacks();
        this.props.loadFactions();
        this.props.loadRestrictedList();

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
                    <ErrorBoundary navigate={ this.props.navigate } errorPath={ this.props.path } message={ 'We\'re sorry - something\'s gone wrong.' }>
                        <CSSTransitionGroup transitionName='pages' transitionEnterTimeout={ 600 } transitionLeaveTimeout={ 600 }>
                            { component }
                        </CSSTransitionGroup>
                    </ErrorBoundary>
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
    loadRestrictedList: PropTypes.func,
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
