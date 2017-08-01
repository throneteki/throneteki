import React from 'react';
import moment from 'moment';

class DeckRow extends React.Component {
    render() {
        return (
            <div className={ this.props.active ? 'deck-row active' : 'deck-row' } key={ this.props.deck.name } onClick={ this.props.onClick }>
                <div className='col-xs-1 deck-image'><img className='card-small' src={ '/img/cards/' + this.props.deck.faction.value + '.png' } /></div>
                <span className='col-xs-9 col-sm-8 col-lg-9 deck-name'>{ this.props.deck.name }</span><span className='col-xs-2 col-md-3 col-lg-2 deck-status text-right'>{ this.props.deck.validation.status }</span>
                <div className='row small'>
                    <span className='col-xs-7 col-sm-6 col-md-7 deck-factionagenda'>{ this.props.deck.faction.name }{ this.props.deck.agenda && this.props.deck.agenda.label ? <span>/{ this.props.deck.agenda.label }</span> : null }</span>
                    <span className='col-xs-3 deck-date text-right'>{ moment(this.props.deck.lastUpdated).format('Do MMMM YYYY') }</span>
                </div>
            </div>);
    }
}

DeckRow.displayName = 'DeckRow';
DeckRow.propTypes = {
    active: React.PropTypes.bool,
    deck: React.PropTypes.object,
    onClick: React.PropTypes.func
};

export default DeckRow;
