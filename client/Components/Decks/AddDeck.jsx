import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';

import DeckSummary from './DeckSummary';
import DeckEditor from './DeckEditor';
import AlertPanel from '../Site/AlertPanel';
import Panel from '../Site/Panel';
import * as actions from '../../actions';

export class AddDeck extends React.Component {
    constructor() {
        super();

        this.state = {
            error: '',
            faction: {},
            deck: undefined
        };

        this.onAddDeck = this.onAddDeck.bind(this);
        this.onDeckUpdated = this.onDeckUpdated.bind(this);
    }

    componentWillMount() {
        this.props.addDeck();
    }

    componentWillUpdate(props) {
        if(props.deckSaved) {
            this.props.navigate('/decks');

            return;
        }
    }

    onAddDeck(deck) {
        this.props.saveDeck(deck);
    }

    onDeckUpdated(deck) {
        this.setState({ deck: deck });
    }

    render() {
        let content;

        if(this.props.loading) {
            content = <div>Loading decks from the server...</div>;
        } else if(this.props.apiError) {
            content = <AlertPanel type='error' message={ this.props.apiError } />;
        } else {
            content = (
                <div>
                    <div className='col-sm-6'>
                        <Panel title='Deck Editor'>
                            <DeckEditor onDeckSave={ this.onAddDeck } onDeckUpdated={ this.onDeckUpdated } deck={ this.state.deck } />
                        </Panel>
                    </div>
                    <div className='col-sm-6'>
                        <Panel title={ this.state.deck ? this.state.deck.name : 'New Deck' }>
                            <DeckSummary cards={ this.props.cards } deck={ this.state.deck } />
                        </Panel>
                    </div>
                </div>);
        }

        return content;
    }
}

AddDeck.displayName = 'AddDeck';
AddDeck.propTypes = {
    addDeck: PropTypes.func,
    agendas: PropTypes.object,
    apiError: PropTypes.string,
    cards: PropTypes.object,
    deckSaved: PropTypes.bool,
    factions: PropTypes.object,
    loading: PropTypes.bool,
    navigate: PropTypes.func,
    saveDeck: PropTypes.func
};

function mapStateToProps(state) {
    return {
        agendas: state.cards.agendas,
        apiError: state.api.message,
        cards: state.cards.cards,
        deckSaved: state.cards.deckSaved,
        factions: state.cards.factions,
        loading: state.api.loading,
        socket: state.lobby.socket
    };
}

export default connect(mapStateToProps, actions)(AddDeck);
