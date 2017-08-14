import React from 'react';

import Avatar from '../Avatar.jsx';

export class PlayerStats extends React.Component {
    constructor() {
        super();

        this.sendUpdate = this.sendUpdate.bind(this);
    }

    sendUpdate(type, direction) {
        this.props.sendGameMessage('changeStat', type, direction === 'up' ? 1 : -1);
    }

    getStatValueOrDefault(stat) {
        if(!this.props.stats) {
            return 0;
        }

        return this.props.stats[stat] || 0;
    }

    getButton(stat, name, statToSet = stat) {
        return (
            <div className='state'>
                <span><img src={ '/img/' + name + '.png' } title={ name } alt={ name } /></span>
                { this.props.showControls ? <button className='btn btn-stat' onClick={ this.sendUpdate.bind(this, statToSet, 'down') }>
                    <img src='/img/Minus.png' title='-' alt='-' />
                </button> : null }

                <span>{ this.getStatValueOrDefault(stat) }</span>
                { this.props.showControls ? <button className='btn btn-stat' onClick={ this.sendUpdate.bind(this, statToSet, 'up') }>
                    <img src='/img/Plus.png' title='+' alt='+' />
                </button> : null }
            </div>
        );
    }

    render() {
        var playerAvatar = (
            <div className='player-avatar'>
                <Avatar emailHash={ this.props.user ? this.props.user.emailHash : 'unknown' } />
                <b>{ this.props.user ? this.props.user.username : 'Noone' }</b>
            </div>);

        return (
            <div className='panel player-stats'>
                { playerAvatar }

                { this.getButton('gold', 'Gold') }
                { this.getButton('totalPower', 'Power', 'power') }
                { this.getButton('reserve', 'Reserve') }
                { this.getButton('claim', 'Claim') }

                { this.props.firstPlayer ? <div className=''>First player</div> : null }
            </div>
        );
    }
}

PlayerStats.displayName = 'PlayerStats';
PlayerStats.propTypes = {
    firstPlayer: React.PropTypes.bool,
    playerName: React.PropTypes.string,
    sendGameMessage: React.PropTypes.func,
    showControls: React.PropTypes.bool,
    stats: React.PropTypes.object,
    user: React.PropTypes.object
};

export default PlayerStats;
