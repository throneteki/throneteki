import React from 'react';
import PropTypes from 'prop-types';

import CardHoverPreview from './CardHoverPreview';
import CardTypeGroups from './CardTypeGroups';
import DeckSummaryHeader from './DeckSummaryHeader';

class DeckSummary extends React.Component {
    constructor() {
        super();

        this.onCardMouseOut = this.onCardMouseOut.bind(this);
        this.onCardMouseOver = this.onCardMouseOver.bind(this);

        this.state = {
            cardToShow: ''
        };
    }

    onCardMouseOver(card) {
        let cardToDisplay = this.props.cards[card.code];

        this.setState({ cardToShow: cardToDisplay });
    }

    onCardMouseOut() {
        this.setState({ cardToShow: undefined });
    }

    render() {
        if(!this.props.deck || !this.props.cards) {
            return <div>Waiting for selected deck...</div>;
        }

        return (
            <div className='deck-summary col-xs-12'>
                { this.state.cardToShow && <CardHoverPreview card={ this.state.cardToShow } /> }
                <DeckSummaryHeader
                    deck={ this.props.deck }
                    onCardMouseOut={ this.onCardMouseOut }
                    onCardMouseOver={ this.onCardMouseOver } />
                <div className='col-xs-12 no-x-padding'>
                    <CardTypeGroups
                        cards={ this.props.deck.plotCards.concat(this.props.deck.drawCards) }
                        onCardMouseOut={ this.onCardMouseOut }
                        onCardMouseOver={ this.onCardMouseOver }
                        useSchemes={ this.props.deck.agenda && this.props.deck.agenda.code === '05045' } />
                </div>
            </div>);
    }
}

DeckSummary.displayName = 'DeckSummary';
DeckSummary.propTypes = {
    cards: PropTypes.object,
    currentRestrictedList: PropTypes.object,
    deck: PropTypes.object
};

export default DeckSummary;
