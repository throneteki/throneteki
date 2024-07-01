import React from 'react';
import classNames from 'classnames';

import Avatar from '../Site/Avatar';

const GamePlayer = (props) => {
    let classes = classNames('game-player-row', {
        'first-player': props.firstPlayer,
        'other-player': !props.firstPlayer
    });

    let playerAndFactionAgenda;

    if (props.firstPlayer) {
        playerAndFactionAgenda = (
            <div className='game-faction-row first-player'>
                <div className='game-player-name'>
                    <span className='gamelist-avatar'>
                        <Avatar username={props.player.name} />
                    </span>
                    <span className='bold'>{props.player.name}</span>
                </div>
                <div className='agenda-mini'>
                    {
                        <img
                            className='img-responsive'
                            src={`/img/cards/${props.player.agenda || 'cardback'}.png`}
                        />
                    }
                </div>
                <div className='faction-mini'>
                    {
                        <img
                            className='img-responsive'
                            src={`/img/cards/${props.player.faction || 'cardback'}.png`}
                        />
                    }
                </div>
            </div>
        );
    } else {
        playerAndFactionAgenda = (
            <div className='game-faction-row other-player'>
                <div className='faction-mini'>
                    {
                        <img
                            className='img-responsive'
                            src={`/img/cards/${props.player.faction || 'cardback'}.png`}
                        />
                    }
                </div>
                <div className='agenda-mini'>
                    {
                        <img
                            className='img-responsive'
                            src={`/img/cards/${props.player.agenda || 'cardback'}.png`}
                        />
                    }
                </div>
                <div className='game-player-name'>
                    <span className='bold'>{props.player.name}</span>
                    <span className='gamelist-avatar'>
                        <Avatar username={props.player.name} />
                    </span>
                </div>
            </div>
        );
    }

    return (
        <div key={props.player.name} className={classes}>
            <div>{playerAndFactionAgenda}</div>
        </div>
    );
};

export default GamePlayer;
