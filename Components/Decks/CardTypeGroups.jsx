import React from 'react';
import PropTypes from 'prop-types';
import CardLink from './CardLink';

class CardTypeGroup extends React.Component {
    hasTrait(card, trait) {
        return card.traits.some(t => t.toLowerCase() === trait.toLowerCase());
    }

    groupCardsByType() {
        const { cards, useSchemes } = this.props;
        let groupedCards = {};

        for(const card of cards) {
            let typeCode = card.card.type;
            if(!typeCode) {
                continue;
            }

            let type = typeCode[0].toUpperCase() + typeCode.slice(1);

            if(useSchemes) {
                if(this.hasTrait(card.card, 'scheme')) {
                    type = 'Scheme';
                }
            }

            if(!groupedCards[type]) {
                groupedCards[type] = [card];
            } else {
                groupedCards[type].push(card);
            }
        }

        return groupedCards;
    }

    renderCardItem(cardQuantity, index) {
        const { onCardClick, onCardMouseOut, onCardMouseOver } = this.props;
        return (
            <div key={ `${cardQuantity.card.code}${index++}` }>
                <span>{ cardQuantity.count + 'x ' }</span>
                <CardLink
                    card={ cardQuantity.card }
                    onClick={ onCardClick }
                    onMouseOut={ onCardMouseOut }
                    onMouseOver={ onCardMouseOver } />
            </div>
        );
    }

    render() {
        let cardsToRender = [];
        let groupedCards = this.groupCardsByType();

        for(const [key, cardList] of Object.entries(groupedCards)) {
            let cards = [];
            let count = 0;
            let index = 0;

            for(const card of cardList) {
                cards.push(this.renderCardItem(card, index++));
                count += parseInt(card.count);
            }

            cardsToRender.push(
                <div className='cards-no-break' key={ key }>
                    <div className='card-group-title'>{ key + ' (' + count.toString() + ')' }</div>
                    <div key={ key } className='card-group'>{ cards }</div>
                </div>);
        }

        return (
            <div className='cards'>
                { cardsToRender }
            </div>);
    }
}

CardTypeGroup.displayName = 'CardTypeGroup';
CardTypeGroup.propTypes = {
    cards: PropTypes.array,
    onCardClick: PropTypes.func,
    onCardMouseOut: PropTypes.func,
    onCardMouseOver: PropTypes.func,
    useSchemes: PropTypes.bool
};

export default CardTypeGroup;
