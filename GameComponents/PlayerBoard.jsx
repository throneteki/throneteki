import React from 'react';
import PropTypes from 'prop-types';
import _ from 'underscore';

import Card from './Card.jsx';
import { tryParseJSON } from '../util.js';

class PlayerBoard extends React.Component {
    onDragOver(event) {
        event.preventDefault();
    }

    onDragDropEvent(event, target) {
        event.stopPropagation();
        event.preventDefault();

        let card = event.dataTransfer.getData('Text');
        if(!card) {
            return;
        }

        let dragData = tryParseJSON(card);

        if(!dragData) {
            return;
        }

        this.props.onDragDrop(dragData.card, dragData.source, target);
    }

    getCardRows() {
        let sortedCards = _.sortBy(this.props.cardsInPlay, card => card.type);

        if(this.props.rowDirection === 'reverse') {
            // we want locations on the bottom, other side wants locations on top
            sortedCards = sortedCards.reverse();
        }

        let rows = _.values(_.groupBy(sortedCards, card => card.type));
        for(let i = rows.length; i < 2; i++) {
            rows.push([]);
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
                onDragDrop={ this.props.onDragDrop }
                onMenuItemClick={ this.props.onMenuItemClick }
                onMouseOut={ this.props.onMouseOut }
                onMouseOver={ this.props.onMouseOver }
                size={ this.props.user.settings.cardSize }
                source='play area' />)
        );
    }

    render() {
        let rows = this.getCardRows();

        let className = 'player-board';
        if(this.props.rowDirection === 'default') {
            className += ' our-side';
        }

        let dragEvents = {};
        if(this.props.onDragDrop) {
            dragEvents.onDragOver = this.onDragOver;
            dragEvents.onDrop = event => this.onDragDropEvent(event, 'play area');
        }

        return (
            <div className={ className } { ...dragEvents } >
                { this.renderRows(rows) }
            </div>);
    }
}

PlayerBoard.displayName = 'PlayerBoard';
PlayerBoard.propTypes = {
    cardsInPlay: PropTypes.array,
    onCardClick: PropTypes.func,
    onDragDrop: PropTypes.func,
    onMenuItemClick: PropTypes.func,
    onMouseOut: PropTypes.func,
    onMouseOver: PropTypes.func,
    rowDirection: PropTypes.oneOf(['default', 'reverse']),
    user: PropTypes.object
};

export default PlayerBoard;
