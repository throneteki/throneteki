import React from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';

import Card from './Card';

class PlayerHand extends React.Component {
    disableMouseOver(revealWhenHiddenTo) {
        if(this.props.spectating && this.props.showHand) {
            return false;
        }

        if(revealWhenHiddenTo === this.props.username) {
            return false;
        }

        return !this.props.isMe;
    }

    getCards(needsSquish) {
        let cards = this.props.cards;
        let cardIndex = 0;
        let handLength = cards ? cards.length : 0;
        let cardWidth = this.getCardWidth();

        let requiredWidth = handLength * cardWidth;
        let overflow = requiredWidth - (cardWidth * 5);
        let offset = overflow / (handLength - 1);

        if(!this.props.isMe) {
            cards = [...this.props.cards].sort((a, b) => a.revealWhenHiddenTo - b.revealWhenHiddenTo);
        }

        let hand = cards.map(card => {
            let left = (cardWidth - offset) * cardIndex++;

            let style = {};
            if(needsSquish) {
                style = {
                    left: left + 'px'
                };
            }

            return (<Card key={ card.uuid } card={ card } style={ style } disableMouseOver={ this.disableMouseOver(card.revealWhenHiddenTo) } source='hand'
                onMouseOver={ this.props.onMouseOver }
                onMouseOut={ this.props.onMouseOut }
                onClick={ this.props.onCardClick }
                size={ this.props.cardSize } />);
        });

        return hand;
    }

    getCardWidth() {
        switch(this.props.cardSize) {
            case 'small':
                return 65 * 0.8;
            case 'large':
                return 65 * 1.4;
            case 'x-large':
                return 65 * 2;
            case 'normal':
            default:
                return 65;
        }
    }

    render() {
        let cardWidth = this.getCardWidth();
        let needsSquish = this.props.cards && this.props.cards.length * cardWidth > (cardWidth * 5);
        let cards = this.getCards(needsSquish);

        let className = classNames('panel', 'hand', {
            [this.props.cardSize]: this.props.cardSize !== 'normal',
            'squish': needsSquish
        });

        return (
            <div className={ className }>
                <div className='panel-header'>
                    { 'Hand (' + cards.length + ')' }
                </div>
                { cards }
            </div>
        );
    }
}

PlayerHand.displayName = 'PlayerHand';
PlayerHand.propTypes = {
    cardSize: PropTypes.string,
    cards: PropTypes.array,
    isMe: PropTypes.bool,
    onCardClick: PropTypes.func,
    onMouseOut: PropTypes.func,
    onMouseOver: PropTypes.func,
    showHand: PropTypes.bool,
    spectating: PropTypes.bool,
    username: PropTypes.string
};

export default PlayerHand;
