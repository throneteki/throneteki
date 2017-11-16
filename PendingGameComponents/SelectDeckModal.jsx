import React from 'react';
import PropTypes from 'prop-types';
import _ from 'underscore';

import AlertPanel from '../SiteComponents/AlertPanel.jsx';
import DeckRow from '../DeckRow.jsx';
import Modal from '../SiteComponents/Modal.jsx';

class SelectDeckModal extends React.Component {
    selectDeck(index) {
        this.props.onDeckSelected(this.props.decks[index]);
    }

    renderDeckRow(deck, index) {
        return (
            <DeckRow
                deck={ deck }
                key={ deck.name + index.toString() }
                onClick={ this.selectDeck.bind(this, index) } />);
    }

    render() {
        let decks = null;

        if(this.props.loading) {
            decks = <div>Loading decks from the server...</div>;
        } else if(this.props.apiError) {
            decks = <AlertPanel type='error' message={ this.props.apiError } />;
        } else {
            decks = _.size(this.props.decks) > 0 ? _.map(this.props.decks, (deck, index) => this.renderDeckRow(deck, index)) : <div>You have no decks, please add one</div>;
        }

        return (
            <Modal id={ this.props.id } className='deck-popup' title='Select Deck'>
                <div className='deck-list-popup'>
                    { decks }
                </div>
            </Modal>);
    }
}

SelectDeckModal.displayName = 'SelectDeckModal';
SelectDeckModal.propTypes = {
    apiError: PropTypes.string,
    decks: PropTypes.array,
    id: PropTypes.string,
    loading: PropTypes.bool,
    onDeckSelected: PropTypes.func
};

export default SelectDeckModal;
