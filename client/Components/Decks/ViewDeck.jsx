import React from 'react';
import PropTypes from 'prop-types';

import ConfirmedButton from '../Form/ConfirmedButton';
import DeckSummary from './DeckSummary';
import Panel from '../Site/Panel';

class ViewDeck extends React.Component {
    constructor() {
        super();

        this.handleDeleteClick = this.handleDeleteClick.bind(this);
        this.handleEditClick = this.handleEditClick.bind(this);
    }

    handleEditClick(event) {
        event.preventDefault();
        this.props.onEditDeck(this.props.deck);
    }

    handleDeleteClick(event) {
        event.preventDefault();
        this.props.onDeleteDeck(this.props.deck);
    }

    render() {
        let { deck, cards } = this.props;

        return (
            <div className='col-sm-7'>
                <Panel title={ deck.name }>
                    <div className='btn-group col-xs-12'>
                        <button className='btn btn-primary' onClick={ this.handleEditClick } disabled={ this.props.deck.lockedForEditing }>Edit</button>
                        <ConfirmedButton onClick={ this.handleDeleteClick } disabled={ this.props.deck.lockedForDeletion }>Delete</ConfirmedButton>
                    </div>
                    <DeckSummary deck={ deck } cards={ cards } />
                </Panel>
            </div>);
    }
}

ViewDeck.propTypes = {
    cards: PropTypes.object,
    deck: PropTypes.object.isRequired,
    onDeleteDeck: PropTypes.func.isRequired,
    onEditDeck: PropTypes.func.isRequired
};

export default ViewDeck;
