import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { toastr } from 'react-redux-toastr';

import AlertPanel from '../Site/AlertPanel';
import Game from './Game';
import * as actions from '../../actions';

class GameList extends React.Component {
    joinGame(game) {
        if(!this.props.user) {
            toastr.error('Please login before trying to join a game');
            return;
        }

        if(game.needsPassword) {
            this.props.joinPasswordGame(game, 'Join');
        } else {
            this.props.socket.emit('joingame', game.id);
        }
    }

    canWatch(game) {
        return !this.props.currentGame && game.allowSpectators;
    }

    watchGame(game) {
        if(!this.props.user) {
            toastr.error('Please login before trying to watch a game');
            return;
        }

        if(game.needsPassword) {
            this.props.joinPasswordGame(game, 'Watch');
        } else {
            this.props.socket.emit('watchgame', game.id);
        }
    }

    removeGame(game) {
        this.props.socket.emit('removegame', game.id);
    }

    canJoin(game) {
        if(this.props.currentGame || game.started || game.full) {
            return false;
        }

        return true;
    }

    getGames(games) {
        let gamesToReturn = [];

        let isAdmin = this.props.user && this.props.user.permissions.canManageGames;

        for(const game of games) {
            if(this.props.gameFilter.showOnlyNewGames && game.started) {
                continue;
            }

            if(!this.props.gameFilter[game.gameType]) {
                continue;
            }

            if(!game.started && game.gamePrivate && !isAdmin) {
                continue;
            }

            gamesToReturn.push((
                <Game key={ game.id }
                    game={ game }
                    showJoinButton={ this.canJoin(game) }
                    showWatchButton={ this.canWatch(game) }
                    onJoinGame={ this.joinGame.bind(this, game) }
                    onRemoveGame={ this.removeGame.bind(this, game) }
                    onWatchGame={ this.watchGame.bind(this, game) }
                    isAdmin={ isAdmin } />
            ));
        }

        return (
            <div>
                { gamesToReturn }
            </div>);
    }

    render() {
        let gameList = this.getGames(this.props.games);

        if(gameList.length === 0) {
            return (<div className='game-list col-xs-12'>
                <AlertPanel type='info' message='There are no games matching the filters you have selected' />
            </div>);
        }

        return (
            <div className='game-list col-xs-12'>
                { gameList }
            </div>);
    }
}

GameList.displayName = 'GameList';
GameList.propTypes = {
    currentGame: PropTypes.object,
    gameFilter: PropTypes.object,
    games: PropTypes.array,
    joinPasswordGame: PropTypes.func,
    showNodes: PropTypes.bool,
    socket: PropTypes.object,
    user: PropTypes.object
};

function mapStateToProps(state) {
    return {
        currentGame: state.lobby.currentGame,
        socket: state.lobby.socket,
        user: state.account.user
    };
}

export default connect(mapStateToProps, actions)(GameList);
