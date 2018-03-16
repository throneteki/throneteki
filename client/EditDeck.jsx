import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';

import DeckSummary from './DeckSummary';
import DeckEditor from './DeckEditor';
import AlertPanel from './SiteComponents/AlertPanel';
import Panel from './SiteComponents/Panel';

import * as actions from './actions';

class EditDeck extends React.Component {
    constructor() {
        super();

        this.onEditDeck = this.onEditDeck.bind(this);
    }

    componentWillMount() {
        if(this.props.deckId) {
            return this.props.loadDeck(this.props.deckId);
        } else if(this.props.deck) {
            return this.props.loadDeck(this.props.deck._id);
        }
    }

    componentWillUpdate(props) {
        if(props.deckSaved) {
            this.props.navigate('/decks');

            return;
        }
    }

    onEditDeck(deck) {
        this.props.saveDeck(deck);
    }

    render() {
        let content;

        if(this.props.apiLoading || !this.props.cards) {
            content = <div>Loading deck from the server...</div>;
        } else if(this.props.apiSuccess === false) {
            content = <AlertPanel type='error' message={ this.props.apiMessage } />;
        } else if(!this.props.deck) {
            content = <AlertPanel message='The specified deck was not found' type='error' />;
        } else {
            content = (
                <div>
                    <div className='col-sm-6'>
                        <Panel title='Deck Editor'>
                            <DeckEditor onDeckSave={ this.onEditDeck } />
                        </Panel>
                    </div>
                    <div className='col-sm-6'>
                        <Panel title={ this.props.deck.name }>
                            <DeckSummary cards={ this.props.cards } deck={ this.props.deck } />
                        </Panel>
                    </div>
                </div>);
        }

        return content;
    }
}

EditDeck.displayName = 'EditDeck';
EditDeck.propTypes = {
    agendas: PropTypes.object,
    apiLoading: PropTypes.bool,
    apiMessage: PropTypes.string,
    apiSuccess: PropTypes.bool,
    banners: PropTypes.array,
    cards: PropTypes.object,
    deck: PropTypes.object,
    deckId: PropTypes.string,
    deckSaved: PropTypes.bool,
    factions: PropTypes.object,
    loadDeck: PropTypes.func,
    navigate: PropTypes.func,
    packs: PropTypes.array,
    saveDeck: PropTypes.func,
    setUrl: PropTypes.func
};

function mapStateToProps(state) {
    return {
        apiLoading: state.api.REQUEST_DECK ? state.api.REQUEST_DECK.loading : undefined,
        apiMessage: state.api.REQUEST_DECK ? state.api.REQUEST_DECK.message : undefined,
        apiSuccess: state.api.REQUEST_DECK ? state.api.REQUEST_DECK.success : undefined,
        agendas: state.cards.agendas,
        apiError: state.api.message,
        banners: state.cards.banners,
        cards: state.cards.cards,
        deck: state.cards.selectedDeck,
        deckSaved: state.cards.deckSaved,
        factions: state.cards.factions,
        loading: state.api.loading,
        socket: state.lobby.socket
    };
}

export default connect(mapStateToProps, actions)(EditDeck);
