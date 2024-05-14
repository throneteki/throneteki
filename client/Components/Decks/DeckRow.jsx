import React from 'react';
import PropTypes from 'prop-types';
import moment from 'moment';
import DeckStatusLabel from './DeckStatusLabel';

class DeckRow extends React.Component {
    constructor() {
        super();

        this.handleDeckClick = this.handleDeckClick.bind(this);
    }

    handleDeckClick() {
        if (this.props.onSelect) {
            this.props.onSelect(this.props.deck);
        }
    }

    displayNameForDeck(deck) {
        if (deck.eventId) {
            let deckEvent = this.props.events.find((e) => e._id === deck.eventId);
            if (deckEvent) {
                return `(${deckEvent.name}) ${deck.name}`;
            }
        }
        return deck.name;
    }

    render() {
        const { deck } = this.props;

        return (
            <div
                className={this.props.active ? 'deck-row active' : 'deck-row'}
                key={this.props.deck.name}
                onClick={this.handleDeckClick}
            >
                <div className='col-xs-1 deck-image'>
                    <img
                        className='card-small'
                        src={'/img/cards/' + this.props.deck.faction.value + '.png'}
                    />
                </div>
                {deck.agenda && (
                    <div className='col-xs-1 deck-image'>
                        <img
                            className='card-small'
                            src={'/img/cards/' + this.props.deck.agenda.code + '.png'}
                        />
                    </div>
                )}
                <span className='col-xs-9 col-md-9 col-lg-10 deck-name'>
                    <span>{this.displayNameForDeck(this.props.deck)}</span>
                    <DeckStatusLabel
                        className='pull-right text-shadow'
                        status={this.props.deck.status}
                    />
                </span>
                <div className='row small'>
                    <span className='col-xs-6 col-md-6 deck-factionagenda'>
                        {this.props.deck.faction.name}
                        {this.props.deck.agenda && this.props.deck.agenda.label ? (
                            <span>/{this.props.deck.agenda.label}</span>
                        ) : null}
                    </span>
                    <span className='col-xs-4 col-md-3 deck-date text-right pull-right'>
                        {moment(this.props.deck.lastUpdated).format('Do MMM YYYY')}
                    </span>
                </div>
            </div>
        );
    }
}

DeckRow.displayName = 'DeckRow';
DeckRow.propTypes = {
    active: PropTypes.bool,
    deck: PropTypes.object.isRequired,
    events: PropTypes.array,
    onSelect: PropTypes.func
};

export default DeckRow;
