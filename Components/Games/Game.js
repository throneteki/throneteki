import React from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import moment from 'moment';

import GamePlayer from './GamePlayer';

function Game(props) {
    let game = props.game;

    let getPlayers = function(game) {
        let firstPlayer = true;
        let players = Object.values(game.players).map(player => {
            let row = <GamePlayer key={ player.name } player={ player } firstPlayer={ firstPlayer } />;

            firstPlayer = false;

            return row;
        });

        if(players.length === 1) {
            if(props.showJoinButton) {
                players.push(
                    <div key={ players[0].name } className={ 'game-player-row other-player' }>
                        <div className='game-faction-row other-player'>
                            <button className='btn btn-primary gamelist-button img-responsive' onClick={ props.onJoinGame }>Join</button>
                        </div>
                    </div>);
            } else {
                players.push(<div key={ players[0].name } className='game-faction-row other-player' />);
            }
        }

        return players;
    };

    let players = getPlayers(game);

    let rowClass = classNames('game-row', {
        [game.node]: game.node && props.isAdmin
    });

    let timeDifference = moment().diff(moment(game.createdAt));
    if(timeDifference < 0) {
        timeDifference = 0;
    }

    let formattedTime = moment.utc(timeDifference).format('HH:mm');

    return (<div key={ game.id }>
        <hr />
        <div className={ rowClass }>
            <div className={ `game-header-row ${game.gameType}` }>
                <span className='game-type'>
                    ({ game.gameType })
                </span>
                <span className='game-title'>
                    <b>{ game.name }</b>
                </span>
                <span className='game-time'>{ `[${formattedTime}]` }</span>
                <span className='game-icons'>
                    { game.useRookery && <img src='/img/RavenIcon.png' className='game-list-icon' alt='Rookery format' /> }
                    { game.showHand && <img src='/img/ShowHandIcon.png' className='game-list-icon' alt='Show hands to spectators' /> }
                    { game.needsPassword && <span className='password-game glyphicon glyphicon-lock' /> }
                    { game.useGameTimeLimit && <img src='/img/Timelimit.png' className='game-list-icon' alt='Time limit used' /> }
                </span>
            </div>
            <div className='game-middle-row'>
                { players }
            </div>
            <div className='game-row-buttons'>
                { props.showWatchButton &&
                    <button className='btn btn-primary gamelist-lower-button' onClick={ props.onWatchGame }>Watch</button> }
                { props.isAdmin && <button className='btn btn-primary gamelist-lower-button' onClick={ props.onRemoveGame }>Remove</button> }
            </div>
        </div>
    </div>);

}

Game.displayName = 'Game';
Game.propTypes = {
    game: PropTypes.object,
    isAdmin: PropTypes.bool,
    onJoinGame: PropTypes.func,
    onRemoveGame: PropTypes.func,
    onWatchGame: PropTypes.func,
    showJoinButton: PropTypes.bool,
    showWatchButton: PropTypes.bool
};

export default Game;
