import React from 'react';
import PropTypes from 'prop-types';
import CardLink from './CardLink';
import { groupCards } from './CardingGrouping';
class CardTypeGroup extends React.Component {
    renderCardItem(cardQuantity, index) {
        const { displayFactionIcons, onCardClick, onCardMouseOut, onCardMouseOver } = this.props;
        return (
            <div key={ `${cardQuantity.card.code}${index++}` } >
                { displayFactionIcons && <span className={ `deck-list-icon thronesicon thronesicon-${cardQuantity.card.faction} with-background` } /> }
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
        const { cards, groupBy, sortCardsBy, useSchemes } = this.props;
        let cardsToRender = [];
        let groupedCards = groupCards({ cards, groupBy, sortCardsBy, useSchemes });

        for(const {cards, group, title} of groupedCards) {
            let renderedCards = [];
            let count = 0;
            let index = 0;

            for(const card of cards) {
                renderedCards.push(this.renderCardItem(card, index++));
                count += parseInt(card.count);
            }

            if(cards.length === 0) {
                continue;
            }

            cardsToRender.push(
                <div className='cards-no-break' key={ group }>
                    <div className='card-group-title'>{ title + ' (' + count.toString() + ')' }</div>
                    <div key={ group } className='card-group'>{ renderedCards }</div>
                </div>);
        }

        let cardsClassName = this.props.displayFactionIcons ? 'cards-two-columns' : 'cards';

        return (
            <div className={ cardsClassName }>
                { cardsToRender }
            </div>);
    }
}

CardTypeGroup.displayName = 'CardTypeGroup';
CardTypeGroup.propTypes = {
    cards: PropTypes.array,
    displayFactionIcons: PropTypes.bool,
    groupBy: PropTypes.oneOf(['type', 'cost']),
    onCardClick: PropTypes.func,
    onCardMouseOut: PropTypes.func,
    onCardMouseOver: PropTypes.func,
    sortCardsBy: PropTypes.oneOf(['name', 'faction']),
    useSchemes: PropTypes.bool
};
CardTypeGroup.defaultProps = {
    sortCardsBy: 'name',
    groupBy: 'type'
};

export default CardTypeGroup;
