import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';

import NewGame from './NewGame';
import GameList from './GameList';
import PendingGame from './PendingGame';
import PasswordGame from './PasswordGame';
import AlertPanel from './SiteComponents/AlertPanel';
import Panel from './SiteComponents/Panel';

import * as actions from './actions';

class InnerGameLobby extends React.Component {
    constructor() {
        super();

        this.onNewGameClick = this.onNewGameClick.bind(this);

        this.state = {
            newGame: false
        };
    }

    componentWillReceiveProps(props) {
        if(!props.currentGame) {
            this.props.setContextMenu([]);
        }

        if(props.username) {
            this.setState({ errorMessage: undefined });
        }
    }

    onNewGameClick(event) {
        event.preventDefault();

        if(!this.props.username) {
            this.setState({ errorMessage: 'Please login before trying to start a new game' });

            return;
        }

        this.props.startNewGame();
    }

    render() {
        var rightside = null;

        if(this.props.passwordGame) {
            rightside = <PasswordGame />;
        } else if(this.props.currentGame) {
            rightside = <PendingGame />;
        }

        return (
            <div className='full-height'>
                { this.props.bannerNotice ? <AlertPanel type='error' message={ this.props.bannerNotice } /> : null }
                { this.state.errorMessage ? <AlertPanel type='error' message={ this.state.errorMessage } /> : null }

                <div className='col-sm-7 full-height'>
                    <Panel title='Current Games'>
                        <button className='btn btn-primary' onClick={ this.onNewGameClick } disabled={ !!this.props.currentGame }>New Game</button>
                        { this.props.games.length === 0 ? <h4>No games are currently in progress</h4> : <GameList games={ this.props.games } /> }
                    </Panel>
                </div>
                <div className='col-sm-5'>
                    { (!this.props.currentGame && this.props.newGame) ? <NewGame defaultGameName={ this.props.username + '\'s game' } /> : null }
                    { rightside }
                </div>
            </div>);
    }
}

InnerGameLobby.displayName = 'GameLobby';
InnerGameLobby.propTypes = {
    bannerNotice: PropTypes.string,
    currentGame: PropTypes.object,
    games: PropTypes.array,
    isAdmin: PropTypes.bool,
    newGame: PropTypes.bool,
    passwordGame: PropTypes.object,
    setContextMenu: PropTypes.func,
    startNewGame: PropTypes.func,
    username: PropTypes.string
};

function mapStateToProps(state) {
    return {
        bannerNotice: state.lobby.notice,
        currentGame: state.lobby.currentGame,
        isAdmin: state.auth.isAdmin,
        games: state.lobby.games,
        newGame: state.games.newGame,
        passwordGame: state.lobby.passwordGame,
        socket: state.lobby.socket,
        username: state.auth.username
    };
}

const GameLobby = connect(mapStateToProps, actions)(InnerGameLobby);

export default GameLobby;

