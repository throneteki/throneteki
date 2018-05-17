import React from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';

import Card from './Card';

class PlayerBoard extends React.Component {
    getCardRows() {

        let sortedCards = this.props.cardsInPlay.sort((a, b) => {
            return b.type - a.type;
        });

        if(this.props.rowDirection === 'reverse') {
            // we want locations on the bottom, other side wants locations on top
            sortedCards = sortedCards.reverse();
        }

        let groupedCards = sortedCards.reduce((group, card) => {
            (group[card.type] = group[card.type] || []).push(card);

            return group;
        }, {});

        let rows = Object.values(groupedCards);
        for(let i = rows.length; i < 2; i++) {
            if(sortedCards.some(card => card.type === 'location')) {
                if(this.props.rowDirection === 'reverse') {
                    rows.push([]);
                } else {
                    rows.unshift([]);
                }
            } else {
                if(this.props.rowDirection === 'reverse') {
                    rows.unshift([]);
                } else {
                    rows.push([]);
                }
            }
        }

        return rows;
    }

    renderRows(rows) {
        return rows.map((row, index) => (
            <div className='card-row' key={ `card-row-${index}` }>
                { this.renderRow(row) }
            </div>
        ));
    }

    renderRow(row) {
        return row.map(card => (
            <Card key={ card.uuid }
                card={ card }
                disableMouseOver={ card.facedown && !card.code }
                onClick={ this.props.onCardClick }
                onMenuItemClick={ this.props.onMenuItemClick }
                onMouseOut={ this.props.onMouseOut }
                onMouseOver={ this.props.onMouseOver }
                size={ this.props.user.settings.cardSize }
                source='play area' />)
        );
    }

    render() {
        let rows = this.getCardRows();

        let className = classNames('player-board', {
            'our-side': this.props.rowDirection === 'default'
        });

        return (
            <div className={ className } >
                { this.renderRows(rows) }
            </div>);
    }
}

PlayerBoard.displayName = 'PlayerBoard';
PlayerBoard.propTypes = {
    cardsInPlay: PropTypes.array,
    onCardClick: PropTypes.func,
    onMenuItemClick: PropTypes.func,
    onMouseOut: PropTypes.func,
    onMouseOver: PropTypes.func,
    rowDirection: PropTypes.oneOf(['default', 'reverse']),
    user: PropTypes.object
};

export default PlayerBoard;
