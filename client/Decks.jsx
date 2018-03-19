import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';

import AlertPanel from './SiteComponents/AlertPanel';
import Panel from './SiteComponents/Panel';
import Link from './Link';
import DeckList from './DeckList';
import ViewDeck from './ViewDeck';

import * as actions from './actions';

class InnerDecks extends React.Component {
    constructor() {
        super();

        this.handleEditDeck = this.handleEditDeck.bind(this);
        this.handleDeleteDeck = this.handleDeleteDeck.bind(this);
    }

    componentWillMount() {
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

        if(this.props.deckDeleted) {
            setTimeout(() => {
                this.props.clearDeckStatus();
            }, 5000);
            successPanel = (
                <AlertPanel message='Deck deleted successfully' type={ 'success' } />
            );
        }

        if(this.props.apiLoading) {
            content = <div>Loading decks from the server...</div>;
        } else if(!this.props.apiSuccess) {
            content = <AlertPanel type='error' message={ this.props.apiMessage } />;
        } else {
            content = (
                <div className='full-height'>
                    <div className='col-xs-12'>
                        { successPanel }
                    </div>
                    <div className='col-sm-5 full-height'>
                        <Panel title='Your decks'>
                            <Link className='btn btn-primary' href='/decks/add'>New Deck</Link>
                            <DeckList className='deck-list' activeDeck={ this.props.selectedDeck } decks={ this.props.decks } onSelectDeck={ this.props.selectDeck } />
                        </Panel>
                    </div>
                    { this.props.selectedDeck &&
                        <ViewDeck deck={ this.props.selectedDeck } cards={ this.props.cards } onEditDeck={ this.handleEditDeck } onDeleteDeck={ this.handleDeleteDeck } />
                    }
                </div>);
        }

        return content;
    }
}

InnerDecks.displayName = 'Decks';
InnerDecks.propTypes = {
    apiLoading: PropTypes.bool,
    apiMessage: PropTypes.string,
    apiSuccess: PropTypes.bool,
    cards: PropTypes.object,
    clearDeckStatus: PropTypes.func,
    deckDeleted: PropTypes.bool,
    decks: PropTypes.array,
    deleteDeck: PropTypes.func,
    loadDecks: PropTypes.func,
    loading: PropTypes.bool,
    navigate: PropTypes.func,
    selectDeck: PropTypes.func,
    selectedDeck: PropTypes.object
};

function mapStateToProps(state) {
    return {
        apiLoading: state.api.REQUEST_DECKS ? state.api.REQUEST_DECKS.loading : undefined,
        apiMessage: state.api.REQUEST_DECKS ? state.api.REQUEST_DECKS.message : undefined,
        apiSuccess: state.api.REQUEST_DECKS ? state.api.REQUEST_DECKS.success : undefined,
        cards: state.cards.cards,
        deckDeleted: state.cards.deckDeleted,
        decks: state.cards.decks,
        loading: state.api.loading,
        selectedDeck: state.cards.selectedDeck
    };
}

const Decks = connect(mapStateToProps, actions)(InnerDecks);

export default Decks;
