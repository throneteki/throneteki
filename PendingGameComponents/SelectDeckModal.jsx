import React from 'react';
import PropTypes from 'prop-types';

import AlertPanel from '../SiteComponents/AlertPanel.jsx';
import DeckList from '../DeckList.jsx';
import Modal from '../SiteComponents/Modal.jsx';

class SelectDeckModal extends React.Component {
    render() {
        let decks = null;

        if(this.props.loading) {
            decks = <div>Loading decks from the server...</div>;
        } else if(this.props.apiError) {
            decks = <AlertPanel type='error' message={ this.props.apiError } />;
        } else {
            decks = <DeckList className='deck-list-popup' decks={ this.props.decks } onSelectDeck={ this.props.onDeckSelected } />;
        }

        return (
            <Modal id={ this.props.id } className='deck-popup' title='Select Deck'>
                { decks }
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
