import React from 'react';
import _ from 'underscore';
import $ from 'jquery';
import {connect} from 'react-redux';

import Input from './FormComponents/Input.jsx';
import Select from './FormComponents/Select.jsx';
import Typeahead from './FormComponents/Typeahead.jsx';
import TextArea from './FormComponents/TextArea.jsx';

import * as actions from './actions';

class InnerDeckEditor extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            cardList: '',
            deck: this.copyDeck(props.deck),
            numberToAdd: 1,
            showBanners: props.deck.agenda && props.deck.agenda.code === '06018',
            selectedBanner: {},
            validation: {
                deckname: '',
                cardToAdd: ''
            }
        };
    }

    componentWillMount() {
        if(!this.props.deck.faction && this.props.factions) {
            let deck = this.copyDeck(this.state.deck);

            deck.faction = this.props.factions['baratheon'];

            this.setState({ deck: deck });
            this.props.updateDeck(deck);
        }

        let cardList = '';

        if(this.props.deck && (this.props.deck.drawCards || this.props.deck.plotCards)) {
            _.each(this.props.deck.drawCards, card => {
                cardList += card.count + ' ' + card.card.label + '\n';
            });

            _.each(this.props.deck.plotCards, card => {
                cardList += card.count + ' ' + card.card.label + '\n';
            });

            this.setState({ cardList: cardList });
        }
    }

    // XXX One could argue this is a bit hacky, because we're updating the innards of the deck object, react doesn't update components that use it unless we change the reference itself
    copyDeck(deck) {
        if(!deck) {
            return { name: 'New Deck'};
        }

        return {
            _id: deck._id,
            name: deck.name,
            plotCards: deck.plotCards,
            drawCards: deck.drawCards,
            bannerCards: deck.bannerCards,
            faction: deck.faction,
            agenda: deck.agenda,
            validation: deck.validation
        };
    }

    onChange(field, event) {
        let deck = this.copyDeck(this.state.deck);

        deck[field] = event.target.value;

        this.setState({ deck: deck });
        this.props.updateDeck(deck);
    }

    onNumberToAddChange(event) {
        this.setState({ numberToAdd: event.target.value });
    }

    onFactionChange(selectedFaction) {
        let deck = this.copyDeck(this.state.deck);

        deck.faction = selectedFaction;

        this.setState({ deck: deck });
        this.props.updateDeck(deck);
    }

    onAgendaChange(selectedAgenda) {
        let deck = this.copyDeck(this.state.deck);

        deck.agenda = selectedAgenda;

        this.setState({ deck: deck, showBanners: deck.agenda && deck.agenda.code === '06018' }); // Alliance
        this.props.updateDeck(deck);
    }

    onBannerChange(selectedBanner) {
        this.setState({ selectedBanner: selectedBanner });
    }

    onAddBanner(event) {
        event.preventDefault();

        if(!this.state.selectedBanner) {
            return;
        }

        if(!this.state.deck.bannerCards) {
            this.state.deck.bannerCards = [];
        }

        if(_.any(this.state.deck.bannerCards, banner => {
            return banner.code === this.state.selectedBanner.code;
        })) {
            return;
        }

        let deck = this.copyDeck(this.state.deck);
        deck.bannerCards.push(this.state.selectedBanner);

        this.setState({ deck: deck });
        this.props.updateDeck(deck);
    }

    onRemoveBanner(banner) {
        let deck = this.copyDeck(this.state.deck);

        deck.bannerCards = _.reject(deck.bannerCards, card => {
            return card.code === banner.code;
        });

        this.setState({ deck: deck });
        this.props.updateDeck(deck);
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
        cardList += this.state.numberToAdd + ' ' + this.state.cardToAdd.label + '\n';

        this.addCard(this.state.cardToAdd, parseInt(this.state.numberToAdd));
        this.setState({ cardList: cardList });
        let deck = this.state.deck;

        deck = this.copyDeck(deck);
        
        this.props.updateDeck(deck);
    }

    onCardListChange(event) {
        let deck = this.state.deck;

        let split = event.target.value.split('\n');

        let headerMark = _.findIndex(split, line => line.match(/^Packs:/));
        if(headerMark >= 0) { // ThronesDB-style deck header found
                              // extract deck title, faction, agenda, and banners
            let header = _.filter(_.first(split, headerMark), line => line !== '');
            split = _.rest(split, headerMark);

            if(header.length >= 2) {
                deck.name = header[0];

                let faction = _.find(this.props.factions, faction => faction.name === header[1].trim());
                if(faction) {
                    deck.faction = faction;
                }

                header = _.rest(header, 2);

                if(header.length >= 1) {
                    let rawAgenda, rawBanners;

                    if(_.any(header, line => {
                        return line.trim() === 'Alliance';
                    })) {
                        rawAgenda = 'Alliance';
                        rawBanners = _.filter(header, line => line.trim() !== 'Alliance');
                    } else {
                        rawAgenda = header[0].trim();
                    }

                    let agenda = _.find(this.props.agendas, agenda => agenda.name === rawAgenda);
                    if(agenda) {
                        deck.agenda = agenda;
                    }

                    if(rawBanners) {
                        let banners = _.map(rawBanners, rawBanner => {
                            return _.find(this.props.banners, banner => {
                                return rawBanner.trim() === banner.label;
                            });
                        });

                        deck.bannerCards = banners;
                    }
                }
            }
        }

        deck.plotCards = [];
        deck.drawCards = [];

        _.each(split, line => {
            line = line.trim();
            let index = 2;

            if(!$.isNumeric(line[0])) {
                return;
            }

            let num = parseInt(line[0]);
            if(line[1] === 'x') {
                index++;
            }

            let packOffset = line.indexOf('(');
            let cardName = line.substr(index, packOffset === -1 ? line.length : packOffset - index - 1);
            let packName = line.substr(packOffset + 1, line.length - packOffset - 2);

            let pack = _.find(this.props.packs, function(pack) {
                return pack.code.toLowerCase() === packName.toLowerCase() || pack.name.toLowerCase() === packName.toLowerCase();
            });

            let card = _.find(this.props.cards, function(card) {
                if(pack) {
                    return card.label.toLowerCase() === cardName.toLowerCase() || card.label.toLowerCase() === (cardName + ' (' + pack.code + ')').toLowerCase();
                }

                return card.label.toLowerCase() === cardName.toLowerCase();
            });

            if(card) {
                this.addCard(card, num);
            }
        });

        deck = this.copyDeck(deck);

        this.setState({ cardList: event.target.value, deck: deck, showBanners: deck.agenda && deck.agenda.code === '06018' }); // Alliance
        this.props.updateDeck(deck);
    }

    addCard(card, number) {
        let deck = this.copyDeck(this.state.deck);
        let plots = deck.plotCards;
        let draw = deck.drawCards;

        let list;

        if(card.type_code === 'plot') {
            list = plots;
        } else {
            list = draw;
        }

        if(list[card.code]) {
            list[card.code].count += number;
        } else {
            list.push({ count: number, card: card });
        }
    }

    onSaveClick(event) {
        event.preventDefault();

        if(this.props.onDeckSave) {
            this.props.onDeckSave(this.props.deck);
        }
    }

    getBannerList() {
        if(_.size(this.props.deck.bannerCards) === 0) {
            return null;
        }

        return _.map(this.props.deck.bannerCards, card => {
            return (<div>
                <span key={ card.code } className='card-link col-sm-10'>{ card.label }</span>
                <span className='glyphicon glyphicon-remove icon-danger btn col-sm-1' aria-hidden='true' onClick={ this.onRemoveBanner.bind(this, card) } />
            </div>);
        });
    }

    render() {
        if(!this.props.deck || this.props.loading) {
            return <div>Waiting for deck...</div>;
        }

        let banners = this.getBannerList();

        return (
            <div className='col-sm-6'>
                <h2>Deck Editor</h2>
                <h4>Either type the cards manually into the box below, add the cards one by one using the card box and autocomplete or for best results, copy and paste a decklist from <a href='http://thronesdb.com' target='_blank'>Thrones DB</a> into the box below.</h4>
                <form className='form form-horizontal'>
                    <Input name='deckName' label='Deck Name' labelClass='col-sm-3' fieldClass='col-sm-9' placeholder='Deck Name'
                        type='text' onChange={this.onChange.bind(this, 'name')} value={ this.state.deck.name } />
                    <Select name='faction' label='Faction' labelClass='col-sm-3' fieldClass='col-sm-9' options={ _.toArray(this.props.factions) }
                        onChange={ this.onFactionChange.bind(this) } value={ this.state.deck.faction ? this.state.deck.faction.value : undefined } />
                    <Select name='agenda' label='Agenda' labelClass='col-sm-3' fieldClass='col-sm-9' options={ _.toArray(this.props.agendas) }
                        onChange={ this.onAgendaChange.bind(this) } value={ this.state.deck.agenda ? this.state.deck.agenda.code : undefined }
                        valueKey='code' nameKey='label' blankOption={ { label: '- Select -', code: '' } } />

                    { this.state.showBanners &&
                    <div>
                        <Select name='banners' label ='Banners' labelClass='col-sm-3' fieldClass='col-sm-9' options={ this.props.banners }
                            onChange={ this.onBannerChange.bind(this) } value={ this.state.selectedBanner ? this.state.selectedBanner.code : undefined }
                            valueKey='code' nameKey='label'
                            blankOption={ { label: '- Select -', code: '' } } button={ { text:'Add', onClick: this.onAddBanner.bind(this) } } />
                        <div className='col-sm-9 col-sm-offset-3 banner-list'>
                            { banners }
                        </div>
                    </div>
                    }
                    <Typeahead label='Card' labelClass={'col-sm-3'} fieldClass='col-sm-4' labelKey={'label'} options={ _.toArray(this.props.cards) }
                        onChange={ this.addCardChange.bind(this) }>
                        <Input name='numcards' type='text' label='Num' labelClass='col-sm-1' fieldClass='col-sm-2'
                            value={ this.state.numberToAdd.toString() } onChange={ this.onNumberToAddChange.bind(this) }>
                            <div className='col-sm-1'>
                                <button className='btn btn-default' onClick={ this.onAddCard.bind(this) }>Add</button>
                            </div>
                        </Input>
                    </Typeahead>
                    <TextArea label='Cards' labelClass='col-sm-3' fieldClass='col-sm-9' rows='25' value={ this.state.cardList }
                        onChange={ this.onCardListChange.bind(this) } />
                    <div className='form-group'>
                        <div className='col-sm-offset-3 col-sm-8'>
                            <button ref='submit' type='submit' className='btn btn-primary' onClick={ this.onSaveClick.bind(this) }>{ this.props.mode }</button>
                        </div>
                    </div>
                </form>
            </div>
        );
    }
}

InnerDeckEditor.displayName = 'DeckEditor';
InnerDeckEditor.propTypes = {
    agendas: React.PropTypes.object,
    banners: React.PropTypes.array,
    cards: React.PropTypes.object,
    deck: React.PropTypes.object,
    factions: React.PropTypes.object,
    loading: React.PropTypes.bool,
    mode: React.PropTypes.string,
    onDeckSave: React.PropTypes.func,
    packs: React.PropTypes.array,
    updateDeck: React.PropTypes.func
};

function mapStateToProps(state) {
    return {
        apiError: state.api.message,
        agendas: state.cards.agendas,
        banners: state.cards.banners,
        cards: state.cards.cards,
        deck: state.cards.selectedDeck,
        decks: state.cards.decks,
        factions: state.cards.factions,
        loading: state.api.loading,
        packs: state.cards.packs
    };
}

const DeckEditor = connect(mapStateToProps, actions)(InnerDeckEditor);

export default DeckEditor;
