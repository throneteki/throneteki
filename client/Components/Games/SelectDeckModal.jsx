import React from 'react';
import PropTypes from 'prop-types';

import AlertPanel from '../Site/AlertPanel';
import DeckList from '../Decks/DeckList';
import Modal from '../Site/Modal';

class SelectDeckModal extends React.Component {
    render() {
        let renderedDeckList = null;

        if (this.props.loading) {
            renderedDeckList = <div>Loading decks from the server...</div>;
        } else if (this.props.apiError) {
            renderedDeckList = <AlertPanel type='error' message={this.props.apiError} />;
        } else {
            let { allowStandaloneDecks, decks, filterDecks, standaloneDecks } = this.props;

            decks = decks.filter(filterDecks);

            renderedDeckList = (
                <div>
                    <DeckList
                        className='deck-list-popup'
                        decks={decks}
                        onSelectDeck={this.props.onDeckSelected}
                        events={this.props.events}
                    />
                    {allowStandaloneDecks && standaloneDecks && standaloneDecks.length !== 0 && (
                        <div>
                            <h3 className='deck-list-header'>Or choose a standalone deck:</h3>
                            <DeckList
                                className='deck-list-popup'
                                decks={standaloneDecks}
                                onSelectDeck={this.props.onDeckSelected}
                                events={this.props.events}
                            />
                        </div>
                    )}
                </div>
            );
        }

        return (
            <Modal id={this.props.id} className='deck-popup' title='Select Deck'>
                {renderedDeckList}
            </Modal>
        );
    }
}

SelectDeckModal.displayName = 'SelectDeckModal';
SelectDeckModal.propTypes = {
    allowStandaloneDecks: PropTypes.bool,
    apiError: PropTypes.string,
    decks: PropTypes.array,
    events: PropTypes.array,
    filterDecks: PropTypes.func,
    id: PropTypes.string,
    loading: PropTypes.bool,
    onDeckSelected: PropTypes.func,
    standaloneDecks: PropTypes.array
};
SelectDeckModal.defaultProps = {
    allowStandaloneDecks: true,
    filterDecks: () => true
};

export default SelectDeckModal;
