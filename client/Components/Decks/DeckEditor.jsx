import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';

import Input from '../Form/Input';
import Select from '../Form/Select';
import Typeahead from '../Form/Typeahead';
import TextArea from '../Form/TextArea';
import validateDeck from '../../deck-validator';
import * as actions from '../../actions';

class DeckEditor extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            bannerCards: [],
            cardList: '',
            rookeryList: '',
            deckName: 'New Deck',
            drawCards: [],
            faction: props.factions && props.factions['baratheon'],
            numberToAdd: 1,
            plotCards: [],
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
            this.state.status = props.deck.status;

            let cardList = '';
            for(const card of props.deck.drawCards) {
                cardList += this.formatCardListItem(card) + '\n';
            }

            for(const plot of props.deck.plotCards) {
                cardList += this.formatCardListItem(plot) + '\n';
            }

            this.state.cardList = cardList;
        }
    }

    componentDidMount() {
        this.triggerDeckUpdated();
    }

    componentWillReceiveProps(props) {
        if(props.factions && !this.state.faction) {
            this.setState({ faction: props.factions['baratheon'] }, this.triggerDeckUpdated);
        }
    }

    getDeckFromState() {
        let deck = {
            _id: this.state.deckId,
            name: this.state.deckName,
            faction: this.state.faction,
            agenda: this.state.agenda,
            bannerCards: this.state.bannerCards,
            plotCards: this.state.plotCards,
            drawCards: this.state.drawCards,
            rookeryCards: this.state.rookeryCards
        };

        if(!this.props.restrictedList) {
            deck.status = {};
        } else {
            deck.status = validateDeck(deck, { packs: this.props.packs, restrictedList: this.props.restrictedList });
        }

        return deck;
    }

    triggerDeckUpdated() {
        const deck = this.getDeckFromState();

        if(this.props.onDeckUpdated) {
            this.props.onDeckUpdated(deck);
        }
    }

    formatCardListItem(card) {
        if(card.card.custom) {
            let typeCode = card.card.type;
            let typeName = typeCode[0].toUpperCase() + typeCode.slice(1);
            return card.count + ' Custom ' + typeName + ' - ' + card.card.name;
        }

        return card.count + ' ' + card.card.label;
    }

    isAllianceAgenda(agenda) {
        return agenda && agenda.code === '06018';
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

    onAddCard(event) {
        event.preventDefault();

        if(!this.state.cardToAdd || !this.state.cardToAdd.label) {
            return;
        }

        let cardList = this.state.cardList;
        cardList += `${this.state.numberToAdd}  ${this.state.cardToAdd.label}\n`;

        if(this.state.cardToAdd.type === 'plot') {
            let plots = this.state.plotCards;
            this.addCard(plots, this.state.cardToAdd, parseInt(this.state.numberToAdd));
            this.setState({ cardList: cardList, plotCards: plots }, this.triggerDeckUpdated);
        } else {
            let cards = this.state.drawCards;
            this.addCard(cards, this.state.cardToAdd, parseInt(this.state.numberToAdd));
            this.setState({ cardList: cardList, drawCards: cards }, this.triggerDeckUpdated);
        }
    }

    onRookeryListChange(event) {
        let split = event.target.value.split('\n');
        let rookeryCards = [];

        for(const line of split) {
            let trimmedLine = line.trim();
            let index = 2;

            let num = parseInt(trimmedLine[0]);
            if(isNaN(num)) {
                continue;
            }

            if(line[1] === 'x') {
                index++;
            }

            let card = this.lookupCard(trimmedLine, index);
            if(card) {
                this.addCard(rookeryCards, card, num);
            }
        }

        this.setState({ rookeryList: event.target.value, rookeryCards: rookeryCards }, this.triggerDeckUpdated);
    }

    onCardListChange(event) {
        let split = event.target.value.split('\n');
        let { deckName, faction, agenda, bannerCards, plotCards, drawCards } = this.state;

        let headerMark = split.findIndex(line => line.match(/^Packs:/));
        if(headerMark >= 0) {
            // ThronesDB-style deck header found
            // extract deck title, faction, agenda, and banners
            let header = split.slice(0, headerMark).filter(line => line !== '');
            split = split.slice(headerMark);

            if(header.length >= 2) {
                deckName = header[0];

                let newFaction = Object.values(this.props.factions).find(faction => faction.name === header[1].trim());
                if(newFaction) {
                    faction = newFaction;
                }

                header = header.slice(2);
                if(header.length >= 1) {
                    let rawAgenda, rawBanners;

                    if(header.some(line => {
                        return line.trim() === 'Alliance';
                    })) {
                        rawAgenda = 'Alliance';
                        rawBanners = header.filter(line => line.trim() !== 'Alliance');
                    } else {
                        rawAgenda = header[0].trim();
                    }

                    let newAgenda = Object.values(this.props.agendas).find(agenda => agenda.name === rawAgenda);
                    if(newAgenda) {
                        agenda = newAgenda;
                    }

                    if(rawBanners) {
                        let banners = rawBanners.map(rawBanner => {
                            return this.props.banners.find(banner => {
                                return rawBanner.trim() === banner.label;
                            });
                        });

                        bannerCards = banners;
                    }
                }
            }
        }

        plotCards = [];
        drawCards = [];

        for(const line of split) {
            let trimmedLine = line.trim();
            let index = 2;

            let num = parseInt(trimmedLine[0]);
            if(isNaN(num)) {
                continue;
            }

            if(line[1] === 'x') {
                index++;
            }

            let card = this.lookupCard(trimmedLine, index);
            if(card) {
                this.addCard(card.type === 'plot' ? plotCards : drawCards, card, num);
            }
        }

        this.setState({
            cardList: event.target.value,
            deckName: deckName,
            faction: faction,
            agenda: agenda,
            bannerCards: bannerCards,
            showBanners: this.isAllianceAgenda(agenda),
            plotCards: plotCards,
            drawCards: drawCards
        }, this.triggerDeckUpdated);
    }

    lookupCard(line, index) {
        let packOffset = line.indexOf('(');
        let cardName = line.substr(index, packOffset === -1 ? line.length : packOffset - index - 1).trim();
        let packName = line.substr(packOffset + 1, line.length - packOffset - 2);

        if(cardName.startsWith('Custom ')) {
            return this.createCustomCard(cardName);
        }

        let pack = this.props.packs.find(pack => {
            return pack.code.toLowerCase() === packName.toLowerCase() || pack.name.toLowerCase() === packName.toLowerCase();
        });

        return Object.values(this.props.cards).find(card => {
            if(pack) {
                return card.label.toLowerCase() === cardName.toLowerCase() || card.label.toLowerCase() === (cardName + ' (' + pack.code + ')').toLowerCase();
            }

            return card.label.toLowerCase() === cardName.toLowerCase();
        });
    }

    createCustomCard(cardName) {
        let match = /Custom (.*) - (.*)/.exec(cardName);
        if(!match) {
            return null;
        }

        let type = match[1].toLowerCase();
        let name = match[2];

        return {
            code: 'custom_' + type,
            cost: 0,
            custom: true,
            faction: 'neutral',
            icons: {
                military: true,
                intrigue: true,
                power: true
            },
            label: name + ' (Custom)',
            loyal: false,
            name: name,
            packCode: 'Custom',
            plotStats: {
                claim: 0,
                income: 0,
                initiative: 0,
                reserve: 0
            },
            strength: 0,
            text: 'Custom',
            traits: [],
            type: type,
            unique: name.includes('*')
        };
    }

    addCard(list, card, number) {
        if(list[card.code]) {
            list[card.code].count += number;
        } else {
            list.push({ count: number, card: card });
        }
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
        if(!this.props.factions || !this.props.agendas || !this.props.cards) {
            return <div>Please wait while loading from the server...</div>;
        }

        let banners = this.getBannerList();

        return (
            <div>
                <div className='form-group'>
                    <div className='col-xs-12 deck-buttons'>
                        <span className='col-xs-2'><button className='' ref='submit' type='submit' className='btn btn-primary' onClick={ this.onSaveClick.bind(this) }>Save</button></span>
                        <button ref='submit' type='button' className='btn btn-primary' onClick={ this.onCancelClick.bind(this) }>Cancel</button>
                    </div>
                </div>

                <h4>Either type the cards manually into the box below, add the cards one by one using the card box and autocomplete or for best results, copy and paste a decklist from <a href='http://thronesdb.com' target='_blank'>Thrones DB</a> into the box below.</h4>
                <form className='form form-horizontal'>
                    <Input name='deckName' label='Deck Name' labelClass='col-sm-3' fieldClass='col-sm-9' placeholder='Deck Name'
                        type='text' onChange={ this.onChange.bind(this, 'deckName') } value={ this.state.deckName } />
                    <Select name='faction' label='Faction' labelClass='col-sm-3' fieldClass='col-sm-9' options={ Object.values(this.props.factions) }
                        onChange={ this.onFactionChange.bind(this) } value={ this.state.faction ? this.state.faction.value : undefined } />
                    <Select name='agenda' label='Agenda' labelClass='col-sm-3' fieldClass='col-sm-9' options={ Object.values(this.props.agendas) }
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
                    <Typeahead label='Card' labelClass={ 'col-sm-3 col-xs-2' } fieldClass='col-sm-4 col-xs-5' labelKey={ 'label' } options={ Object.values(this.props.cards) }
                        onChange={ this.addCardChange.bind(this) }>
                        <Input name='numcards' type='text' label='Num' labelClass='col-xs-1 no-x-padding' fieldClass='col-xs-2'
                            value={ this.state.numberToAdd.toString() } onChange={ this.onNumberToAddChange.bind(this) } noGroup>
                            <div className='col-xs-1 no-x-padding'>
                                <button className='btn btn-primary' onClick={ this.onAddCard.bind(this) }>Add</button>
                            </div>
                        </Input>
                    </Typeahead>
                    <TextArea label='Cards' labelClass='col-sm-3' fieldClass='col-sm-9' rows='10' value={ this.state.cardList }
                        onChange={ this.onCardListChange.bind(this) } />
                    <TextArea label='Rookery' labelClass='col-sm-3' fieldClass='col-sm-9' rows='4' value={ this.state.rookeryList }
                        onChange={ this.onRookeryListChange.bind(this) } />

                    <div className='form-group'>
                        <div className='col-sm-offset-3 col-sm-8'>
                            <button ref='submit' type='submit' className='btn btn-primary' onClick={ this.onSaveClick.bind(this) }>Save</button>
                        </div>
                    </div>
                </form>
            </div>
        );
    }
}

DeckEditor.displayName = 'DeckEditor';
DeckEditor.propTypes = {
    agendas: PropTypes.object,
    banners: PropTypes.array,
    cards: PropTypes.object,
    deck: PropTypes.object,
    factions: PropTypes.object,
    navigate: PropTypes.func,
    onDeckSave: PropTypes.func,
    onDeckUpdated: PropTypes.func,
    packs: PropTypes.array,
    restrictedList: PropTypes.array,
    updateDeck: PropTypes.func
};

function mapStateToProps(state) {
    return {
        agendas: state.cards.agendas,
        banners: state.cards.banners,
        cards: state.cards.cards,
        decks: state.cards.decks,
        factions: state.cards.factions,
        loading: state.api.loading,
        packs: state.cards.packs,
        restrictedList: state.cards.restrictedList
    };
}

export default connect(mapStateToProps, actions)(DeckEditor);
