import React from 'react';
import {connect} from 'react-redux';
import _ from 'underscore';

import Avatar from './Avatar.jsx';
import * as actions from './actions';

class InnerGameList extends React.Component {
    constructor() {
        super();

        this.joinGame = this.joinGame.bind(this);
    }

    joinGame(event, game) {
        event.preventDefault();

        this.props.socket.emit('joingame', game.id);
    }

    canWatch(game) {
        return !this.props.currentGame && game.allowSpectators;
    }

    watchGame(event, game) {
        event.preventDefault();

        this.props.socket.emit('watchgame', game.id);
    }

    render() {
        var gameList = _.map(this.props.games, game => {
            return (
                <div key={ game.id } className='game-row'>
                    { (this.props.currentGame || game.players.length ===2 || game.started) ?
                        null :
                        <button className='btn btn-primary pull-right' onClick={ event => this.joinGame(event, game) }>Join</button>
                    }
                    {this.canWatch(game) ?
                        <button className='btn btn-primary pull-right' onClick={event => this.watchGame(event, game)}>Watch</button> : null}
                    <div><b>{ game.name }</b></div>
                    <div>
                        <Avatar emailHash={game.players[0].emailHash} />
                        <span>{ game.players.length > 0 ? game.players[0].name : '' }</span>
                        { game.players.length === 2 ? <span><b>{' vs '}</b>
                        <Avatar emailHash={game.players[1].emailHash} />
                        { game.players[1].name }</span> : null }</div>
                </div>
            );
        });

        return (
            <div className='game-list'>
                { gameList }
            </div>);
    }
}

InnerGameList.displayName = 'GameList';
InnerGameList.propTypes = {
    currentGame: React.PropTypes.object,
    games: React.PropTypes.array,
    joinGame: React.PropTypes.func,
    socket: React.PropTypes.object
};

function mapStateToProps(state) {
    return {
        currentGame: state.games.currentGame,
        socket: state.socket.socket
    };
}

const GameList = connect(mapStateToProps, actions)(InnerGameList);

export default GameList;

