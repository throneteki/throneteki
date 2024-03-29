import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { validateDeck } from 'throneteki-deck-helper';

import Input from '../Form/Input';
import Select from '../Form/Select';
import ApiStatus from '../Site/ApiStatus';
import CardHoverPreview from './CardHoverPreview';
import CardTypeGroups from './CardTypeGroups';
import DeckSummaryHeader from './DeckSummaryHeader';
import * as actions from '../../actions';

class DraftDeckEditor extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            bannerCards: [],
            cardToShow: null,
            deckName: 'New Deck',
            drawCards: [],
            faction: props.factions && props.factions['baratheon'],
            plotCards: [],
            remainingCards: [],
            showBanners: false,
            selectedBanner: {},
            validation: {
                deckname: '',
                cardToAdd: ''
            }
        };

        if(props.deck) {
            this.state.deckId = props.deck._id;
            this.state.deckName = props.deck.name;
            this.state.plotCards = props.deck.plotCards;
            this.state.drawCards = props.deck.drawCards;
            this.state.bannerCards = props.deck.bannerCards;
            this.state.faction = props.deck.faction;
            this.state.agenda = props.deck.agenda;
            this.state.remainingCards = this.calculateRemainingCards(props.deck);
            this.state.showBanners = this.isAllianceAgenda(props.deck.agenda);
            this.state.status = props.deck.status;
        }
    }

    componentDidMount() {
        this.props.loadEvents();
        this.triggerDeckUpdated();
    }

    componentWillReceiveProps(props) {
        if(props.factions && !this.state.faction) {
            this.setState({ faction: props.factions['baratheon'] }, this.triggerDeckUpdated);
        }
    }

    calculateRemainingCards(deck) {
        let remainingCards = [];

        const allCards = deck.drawCards.concat(deck.plotCards);
        for(const draftCardQuantity of deck.draftedCards) {
            const card = this.props.cards[draftCardQuantity.code];

            if(card.type === 'agenda') {
                continue;
            }

            const usedCardQuantity = allCards.find(cq => cq.card.code === draftCardQuantity.code) || { count: 0, code: draftCardQuantity.code, card };
            if(draftCardQuantity.count > usedCardQuantity.count) {
                remainingCards.push({
                    count: draftCardQuantity.count - usedCardQuantity.count,
                    code: draftCardQuantity.code,
                    card: usedCardQuantity.card
                });
            }
        }

        return remainingCards;
    }

    getDeckFromState() {
        let deck = {
            _id: this.state.deckId,
            name: this.state.deckName,
            eventId: this.props.deck.eventId,
            faction: this.state.faction,
            format: this.props.deck.format,
            agenda: this.state.agenda,
            bannerCards: this.state.bannerCards,
            plotCards: this.state.plotCards,
            drawCards: this.state.drawCards,
            draftedCards: this.props.deck.draftedCards
        };

        if(!this.props.restrictedList && !this.props.currentRestrictedList) {
            deck.status = {};
        } else {
            const draftEventRestrictedList = this.props.restrictedList.filter(rl => rl._id === this.props.deck.eventId)[0];
            const selectedRestrictedList = draftEventRestrictedList || this.props.currentRestrictedList;
            const restrictedLists = selectedRestrictedList ? [selectedRestrictedList] : this.props.restrictedList;
            deck.status = validateDeck(deck, { packs: this.props.packs, restrictedLists });
        }

        return deck;
    }

    triggerDeckUpdated() {
        const deck = this.getDeckFromState();

        if(this.props.onDeckUpdated) {
            this.props.onDeckUpdated(deck);
        }
    }

    isAllianceAgenda(agenda) {
        return agenda && agenda.code === '06018';
    }

    updateHoverCard(card) {
        let cardToDisplay = this.props.cards[card.code];

        this.setState({ cardToShow: cardToDisplay });
    }

    clearHoverCard() {
        this.setState({ cardToShow: undefined });
    }

    handleAddCard(cardCode) {
        let remainingCards = this.state.remainingCards;
        let drawCards = this.state.drawCards;
        let plotCards = this.state.plotCards;

        const cardQuantity = remainingCards.find(cardQuantity => cardQuantity.code === cardCode);
        const card = this.props.cards[cardCode];

        if(cardQuantity.count === 1) {
            remainingCards = remainingCards.filter(cq => cq.code !== cardCode);
        } else {
            cardQuantity.count -= 1;
        }

        if(card.type === 'plot') {
            const existingCardQuantity = plotCards.find(cq => cq.card.code === cardCode);
            if(existingCardQuantity) {
                existingCardQuantity.count += 1;
            } else {
                plotCards.push({ count: 1, card });
            }
        } else {
            const existingCardQuantity = drawCards.find(cq => cq.card.code === cardCode);
            if(existingCardQuantity) {
                existingCardQuantity.count += 1;
            } else {
                drawCards.push({ count: 1, card });
            }
        }

        this.setState({
            drawCards,
            plotCards,
            remainingCards
        }, this.triggerDeckUpdated);
    }

    handleRemoveCard(cardCode) {
        let remainingCards = this.state.remainingCards;
        let drawCards = this.state.drawCards;
        let plotCards = this.state.plotCards;

        const remainingCardQuantity = remainingCards.find(cardQuantity => cardQuantity.code === cardCode);
        const card = this.props.cards[cardCode];

        if(remainingCardQuantity) {
            remainingCardQuantity.count += 1;
        } else {
            remainingCards.push({ count: 1, card, code: cardCode });
        }

        if(card.type === 'plot') {
            const existingCardQuantity = plotCards.find(cq => cq.card.code === cardCode);
            if(existingCardQuantity.count > 1) {
                existingCardQuantity.count -= 1;
            } else {
                plotCards = plotCards.filter(cq => cq.card.code !== cardCode);
            }
        } else {
            const existingCardQuantity = drawCards.find(cq => cq.card.code === cardCode);
            if(existingCardQuantity.count > 1) {
                existingCardQuantity.count -= 1;
            } else {
                drawCards = drawCards.filter(cq => cq.card.code !== cardCode);
            }
        }

        this.setState({
            drawCards,
            plotCards,
            remainingCards
        }, this.triggerDeckUpdated);
    }

    onChange(field, event) {
        let state = this.state;

        state[field] = event.target.value;

        this.setState({ state }, this.triggerDeckUpdated);
    }

    onNumberToAddChange(event) {
        this.setState({ numberToAdd: event.target.value });
    }

    onFactionChange(selectedFaction) {
        this.setState({ faction: selectedFaction }, this.triggerDeckUpdated);
    }

    onAgendaChange(selectedAgenda) {
        let toUpdate = {
            agenda: selectedAgenda,
            showBanners: this.isAllianceAgenda(selectedAgenda)
        };

        if(!toUpdate.showBanners) {
            toUpdate.bannerCards = [];
        }

        this.setState(toUpdate, this.triggerDeckUpdated);
    }

    onBannerChange(selectedBanner) {
        this.setState({ selectedBanner: selectedBanner });
    }

    onAddBanner(event) {
        event.preventDefault();

        if(!this.state.selectedBanner || !this.state.selectedBanner.code) {
            return;
        }

        // Don't allow more than 2 banners
        if(this.state.bannerCards.length >= 2) {
            return;
        }

        // Don't allow duplicate banners
        if(this.state.bannerCards.some(banner => {
            return banner.code === this.state.selectedBanner.code;
        })) {
            return;
        }

        let banners = this.state.bannerCards;
        banners.push(this.state.selectedBanner);

        this.setState({ bannerCards: banners }, this.triggerDeckUpdated);
    }

    onRemoveBanner(banner) {
        const banners = this.state.bannerCards.filter(card => {
            return card.code !== banner.code;
        });

        this.setState({ bannerCards: banners }, this.triggerDeckUpdated);
    }

    addCardChange(selectedCards) {
        this.setState({ cardToAdd: selectedCards[0] });
    }

    onSaveClick(event) {
        event.preventDefault();

        if(this.props.onDeckSave) {
            this.props.onDeckSave(this.getDeckFromState());
        }
    }

    getBannerList() {
        if(this.state.bannerCards.length === 0) {
            return null;
        }

        return this.state.bannerCards.map(card => {
            return (<div key={ card.code }>
                <span key={ card.code } className='card-link col-sm-10'>{ card.label }</span>
                <span className='glyphicon glyphicon-remove icon-danger btn col-sm-1' aria-hidden='true' onClick={ this.onRemoveBanner.bind(this, card) } />
            </div>);
        });
    }

    onCancelClick() {
        this.props.navigate('/decks');
    }

    render() {
        if(!this.props.factions || !this.props.cards || !this.props.restrictedList || !this.props.events) {
            return <div>Please wait while loading from the server...</div>;
        }

        const agendas = this.props.deck.draftedCards.map(cardQuantity => this.props.cards[cardQuantity.code]).filter(card => card.type === 'agenda');
        let banners = this.getBannerList();

        const event = this.props.events.find(event => event._id === this.props.deck.eventId);

        return (
            <div>
                { this.state.cardToShow && <CardHoverPreview card={ this.state.cardToShow } /> }
                <div className='row'>
                    <div className='col-sm-5'>
                        <ApiStatus apiState={ this.props.apiState } successMessage='Deck saved successfully.' />

                        <div className='form-group'>
                            <div className='col-xs-12 deck-buttons'>
                                <span className='col-xs-2'>
                                    <button ref='submit' type='submit' className='btn btn-primary' onClick={ this.onSaveClick.bind(this) }>Save { this.props.apiState && this.props.apiState.loading && <span className='spinner button-spinner' /> }</button>
                                </span>
                                <button ref='submit' type='button' className='btn btn-primary' onClick={ this.onCancelClick.bind(this) }>Cancel</button>
                            </div>
                        </div>

                        <form className='form form-horizontal'>
                            { event && (
                                <div className='form-group'>
                                    <label className='col-sm-3 control-label'>Event:</label>
                                    <div className='col-sm-9 control-label'>{ event.name }</div>
                                </div>
                            ) }
                            <Input name='deckName' label='Deck Name' labelClass='col-sm-3' fieldClass='col-sm-9' placeholder='Deck Name'
                                type='text' onChange={ this.onChange.bind(this, 'deckName') } value={ this.state.deckName } />
                            <Select name='faction' label='Faction' labelClass='col-sm-3' fieldClass='col-sm-9' options={ Object.values(this.props.factions) }
                                onChange={ this.onFactionChange.bind(this) } value={ this.state.faction ? this.state.faction.value : undefined } />
                            <Select name='agenda' label='Agenda' labelClass='col-sm-3' fieldClass='col-sm-9' options={ agendas }
                                onChange={ this.onAgendaChange.bind(this) } value={ this.state.agenda ? this.state.agenda.code : undefined }
                                valueKey='code' nameKey='label' blankOption={ { label: '- Select -', code: '' } } />

                            { this.state.showBanners &&
                                <div>
                                    <Select name='banners' label='Banners' labelClass='col-sm-3' fieldClass='col-sm-9' options={ this.props.banners }
                                        onChange={ this.onBannerChange.bind(this) } value={ this.state.selectedBanner ? this.state.selectedBanner.code : undefined }
                                        valueKey='code' nameKey='label'
                                        blankOption={ { label: '- Select -', code: '' } } button={ { text: 'Add', onClick: this.onAddBanner.bind(this) } } />
                                    <div className='col-sm-9 col-sm-offset-3 banner-list'>
                                        { banners }
                                    </div>
                                </div>
                            }
                        </form>
                    </div>
                    <div className='col-sm-1' />
                    <div className='col-sm-6'>
                        <DeckSummaryHeader
                            deck={ this.getDeckFromState() }
                            onCardMouseOut={ () => this.clearHoverCard() }
                            onCardMouseOver={ card => this.updateHoverCard(card) } />
                    </div>
                </div>
                <div className='row'>
                    <div className='col-sm-12' style={ { textAlign: 'center', marginBottom: '1em' } }>
                        Click cards under the "Remaining Drafted Cards" to move them into your deck and vice-versa.
                    </div>
                </div>
                <div className='row'>
                    <div className='col-sm-5'>
                        <div className='form-group'>
                            <label className='col-sm-12'>Remaining Drafted Cards:</label>
                        </div>
                        <div className='col-sm-12'>
                            <CardTypeGroups
                                cards={ this.state.remainingCards }
                                onCardClick={ card => this.handleAddCard(card.code) }
                                onCardMouseOut={ () => this.clearHoverCard() }
                                onCardMouseOver={ card => this.updateHoverCard(card) }
                                displayFactionIcons />
                        </div>
                    </div>
                    <div className='col-sm-1' style={ { 'textAlign': 'center' } }>
                        <span className='glyphicon glyphicon-arrow-left' />
                        <span className='glyphicon glyphicon-arrow-right' />
                    </div>
                    <div className='col-sm-6'>
                        <div className='form-group'>
                            <label className='col-sm-12'>Deck:</label>
                        </div>
                        <div className='col-sm-12'>
                            <CardTypeGroups
                                cards={ this.state.plotCards.concat(this.state.drawCards) }
                                onCardClick={ card => this.handleRemoveCard(card.code) }
                                onCardMouseOut={ () => this.clearHoverCard() }
                                onCardMouseOver={ card => this.updateHoverCard(card) }
                                useSchemes={ this.state.agenda && this.state.agenda.code === '05045' }
                                displayFactionIcons />
                        </div>
                    </div>
                </div>
            </div>
        );
    }
}

DraftDeckEditor.displayName = 'DraftDeckEditor';
DraftDeckEditor.propTypes = {
    apiState: PropTypes.object,
    banners: PropTypes.array,
    cards: PropTypes.object,
    currentRestrictedList: PropTypes.object,
    deck: PropTypes.object,
    events: PropTypes.array,
    factions: PropTypes.object,
    loadEvents: PropTypes.func,
    navigate: PropTypes.func,
    onDeckSave: PropTypes.func,
    onDeckUpdated: PropTypes.func,
    packs: PropTypes.array,
    restrictedList: PropTypes.array,
    setCurrentRestrictedList: PropTypes.func,
    updateDeck: PropTypes.func
};

function mapStateToProps(state) {
    return {
        apiState: state.api.SAVE_DECK,
        banners: state.cards.banners,
        cards: state.cards.cards,
        currentRestrictedList: state.cards.currentRestrictedList,
        events: state.events.events,
        factions: state.cards.factions,
        loading: state.api.loading,
        packs: state.cards.packs,
        restrictedList: state.cards.restrictedList
    };
}

export default connect(mapStateToProps, actions)(DraftDeckEditor);
