import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';

import AlertPanel from '../Components/Site/AlertPanel';
import Panel from '../Components/Site/Panel';
import Link from '../Components/Site/Link';
import DeckList from '../Components/Decks/DeckList';
import RestrictedListDropdown from '../Components/Decks/RestrictedListDropdown';
import ViewDeck from '../Components/Decks/ViewDeck';
import * as actions from '../actions';

class Decks extends React.Component {
    constructor() {
        super();

        this.handleEditDeck = this.handleEditDeck.bind(this);
        this.handleDeleteDeck = this.handleDeleteDeck.bind(this);
    }

    componentWillMount() {
        this.props.loadEvents();
        this.props.loadDecks();
    }

    handleEditDeck(deck) {
        this.props.navigate(`/decks/edit/${deck._id}`);
    }

    handleDeleteDeck(deck) {
        this.props.deleteDeck(deck);
    }

    render() {
        let content = null;

        let successPanel = null;

        if (this.props.deckDeleted) {
            setTimeout(() => {
                this.props.clearDeckStatus();
            }, 5000);
            successPanel = <AlertPanel message='Deck deleted successfully' type={'success'} />;
        }

        if (
            this.props.apiLoading ||
            !this.props.cards ||
            !this.props.decks ||
            !this.props.restrictedLists
        ) {
            content = <div>Loading decks from the server...</div>;
        } else if (!this.props.apiSuccess) {
            content = <AlertPanel type='error' message={this.props.apiMessage} />;
        } else {
            content = (
                <div className='full-height'>
                    <div className='col-xs-12'>{successPanel}</div>
                    <div className='col-sm-5 full-height'>
                        <Panel title='Your decks'>
                            <div className='form-group'>
                                <Link className='btn btn-primary' href='/decks/add'>
                                    New Deck
                                </Link>
                            </div>
                            <div>
                                <RestrictedListDropdown
                                    currentRestrictedList={this.props.currentRestrictedList}
                                    restrictedLists={this.props.restrictedLists}
                                    setCurrentRestrictedList={this.props.setCurrentRestrictedList}
                                />
                            </div>
                            <DeckList
                                className='deck-list'
                                activeDeck={this.props.selectedDeck}
                                decks={this.props.decks}
                                onSelectDeck={this.props.selectDeck}
                                events={this.props.events}
                            />
                        </Panel>
                    </div>
                    {!!this.props.selectedDeck && (
                        <ViewDeck
                            deck={this.props.selectedDeck}
                            cards={this.props.cards}
                            onEditDeck={this.handleEditDeck}
                            onDeleteDeck={this.handleDeleteDeck}
                        />
                    )}
                </div>
            );
        }

        return content;
    }
}

Decks.displayName = 'Decks';
Decks.propTypes = {
    apiLoading: PropTypes.bool,
    apiMessage: PropTypes.string,
    apiSuccess: PropTypes.bool,
    cards: PropTypes.object,
    clearDeckStatus: PropTypes.func,
    currentRestrictedList: PropTypes.object,
    deckDeleted: PropTypes.bool,
    decks: PropTypes.array,
    deleteDeck: PropTypes.func,
    events: PropTypes.array,
    loadDecks: PropTypes.func,
    loadEvents: PropTypes.func,
    loading: PropTypes.bool,
    navigate: PropTypes.func,
    restrictedLists: PropTypes.array,
    selectDeck: PropTypes.func,
    selectedDeck: PropTypes.object,
    setCurrentRestrictedList: PropTypes.func
};

function mapStateToProps(state) {
    return {
        apiLoading: state.api.REQUEST_DECKS ? state.api.REQUEST_DECKS.loading : undefined,
        apiMessage: state.api.REQUEST_DECKS ? state.api.REQUEST_DECKS.message : undefined,
        apiSuccess: state.api.REQUEST_DECKS ? state.api.REQUEST_DECKS.success : undefined,
        cards: state.cards.cards,
        currentRestrictedList: state.cards.currentRestrictedList,
        deckDeleted: state.cards.deckDeleted,
        decks: state.cards.decks,
        events: state.events.events,
        loading: state.api.loading,
        restrictedLists: state.cards.restrictedList,
        selectedDeck: state.cards.selectedDeck
    };
}

export default connect(mapStateToProps, actions)(Decks);
