import React from 'react';
import PropTypes from 'prop-types';
import _ from 'underscore';
import { connect } from 'react-redux';

import AlertPanel from './SiteComponents/AlertPanel';
import Panel from './SiteComponents/Panel';
import DeckSummary from './DeckSummary';
import Link from './Link';
import DeckRow from './DeckRow';

import * as actions from './actions';

class InnerDecks extends React.Component {
    constructor() {
        super();

        this.onDeleteClick = this.onDeleteClick.bind(this);
        this.onConfirmDeleteClick = this.onConfirmDeleteClick.bind(this);

        this.state = {
            decks: [],
            showDelete: false
        };
    }

    componentWillMount() {
        this.props.loadDecks();
    }

    onDeleteClick(event) {
        event.preventDefault();

        this.setState({ showDelete: !this.state.showDelete });
    }

    onEditClick(event) {
        event.preventDefault();

        this.props.navigate(`/decks/edit/${this.props.selectedDeck._id}`);
    }

    onConfirmDeleteClick(event) {
        event.preventDefault();

        this.props.deleteDeck(this.props.selectedDeck);

        this.setState({ showDelete: false });
    }

    render() {
        var index = 0;

        var decks = _.map(this.props.decks, deck => {
            var row = (<DeckRow key={ deck.name + index.toString() } deck={ deck }
                onClick={ () => this.props.selectDeck(deck) }
                active={ this.props.selectedDeck && deck._id === this.props.selectedDeck._id } />);

            index++;

            return row;
        });

        var deckList = (
            <div>
                { decks }
            </div>
        );

        var deckInfo = null;

        if(this.props.selectedDeck) {
            deckInfo = (<div className='col-sm-7'>
                <Panel title={ this.props.selectedDeck.name }>
                    <div className='btn-group col-xs-12'>
                        <button className='btn btn-primary' onClick={ this.onEditClick.bind(this) }>Edit</button>
                        <button className='btn btn-primary' onClick={ this.onDeleteClick }>Delete</button>
                        { this.state.showDelete ?
                            <button className='btn btn-danger' onClick={ this.onConfirmDeleteClick }>Delete</button> :
                            null }
                    </div>
                    <DeckSummary deck={ this.props.selectedDeck } cards={ this.props.cards } />
                </Panel>
            </div>);
        }

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
                            <div className='deck-list'>{ !this.props.decks || this.props.decks.length === 0 ? 'You have no decks, try adding one.' : deckList }</div>
                        </Panel>
                    </div>
                    { deckInfo }
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
