import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';

import Input from '../Form/Input';
import Select from '../Form/Select';
import Typeahead from '../Form/Typeahead';
import TextArea from '../Form/TextArea';
import * as actions from '../../actions';

class DeckEditor extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            bannerCards: [],
            cardList: '',
            deckName: 'New Deck',
            faction: props.factions['baratheon'],
            numberToAdd: 1,
            showBanners: false,
            selectedBanner: {},
            validation: {
                deckname: '',
                cardToAdd: ''
            }
        };

        if(props.deck) {
            this.state.deckId = props.deck._id;
            this.state.name = props.deck.name;
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

            for(const plot of this.props.deck.plotCards) {
                cardList += this.formatCardListItem(plot) + '\n';
            }

            this.state.cardList = cardList;
        }
    }

    triggerDeckUpdated() {
        if(this.props.onDeckUpdated) {
            this.props.onDeckUpdated({
                _id: this.state.deckId,
                name: this.state.deckName,
                faction: this.state.faction,
                agenda: this.state.agenda,
                bannerCards: this.state.bannerCards,
                plotCards: this.state.plotCards,
                drawCards: this.state.drawCards
            });
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

    onChange(field, event) {
        let state = this.state;

        state[field] = event.target.value;

        this.setState({ state });
        this.triggerDeckUpdated();
    }

    onNumberToAddChange(event) {
        this.setState({ numberToAdd: event.target.value });
    }

    onFactionChange(selectedFaction) {
        let deck = this.copyDeck(this.state.deck);

        deck.faction = selectedFaction;

        this.setState({ faction: selectedFaction });
        this.triggerDeckUpdated();
    }

    onAgendaChange(selectedAgenda) {
        let deck = this.copyDeck(this.state.deck);
        deck.agenda = selectedAgenda;

        let toUpdate = {
            agenda: selectedAgenda,
            isAlliance: this.isAllianceAgenda(selectedAgenda)
        };

        if(!toUpdate.isAlliance) {
            toUpdate.bannerCards = [];
        }

        this.setState({ toUpdate });
        this.triggerDeckUpdated();
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
        if(this.state.deck.bannerCards.length >= 2) {
            return;
        }

        // Don't allow duplicate banners
        if(this.state.deck.bannerCards.some(banner => {
            return banner.code === this.state.selectedBanner.code;
        })) {
            return;
        }

        let banners = this.state.banners;
        banners.push(this.state.selectedBanner);

        this.setState({ bannerCards: banners });
        this.triggerDeckUpdated();
    }

    onRemoveBanner(banner) {
        const banners = this.state.bannerCards.filter(card => {
            return card.code !== banner.code;
        });

        this.setState({ bannerCards: banners });
        this.triggerDeckUpdated();
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
            this.setState({ cardList: cardList, plotCards: plots });
        } else {
            let cards = this.state.drawCards;
            this.addCard(cards, this.state.cardToAdd, parseInt(this.state.numberToAdd));
            this.setState({ cardList: cardList, drawCards: cards });
        }

        this.triggerDeckUpdated();
    }

    onCardListChange(event) {
        let split = event.target.value.split('\n');
        let [deckName, faction, agenda, bannerCards, plotCards, drawCards] = this.state;

        let headerMark = split.findIndex(line => line.match(/^Packs:/));
        if(headerMark >= 0) {
            // ThronesDB-style deck header found
            // extract deck title, faction, agenda, and banners
            let header = split.find(headerMark).filter(line => line !== '');
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

                    let newAgenda = this.props.agendas.find(agenda => agenda.name === rawAgenda);
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
                return;
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
        });
        this.triggerDeckUpdated();
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

        return this.props.cards.find(card => {
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
            this.props.onDeckSave(this.props.deck);
        }
    }

    getBannerList() {
        if(this.props.deck.bannerCards.length === 0) {
            return null;
        }

        return this.props.deck.bannerCards.map(card => {
            return (<div key={ card.code }>
                <span key={ card.code } className='card-link col-sm-10'>{ card.label }</span>
                <span className='glyphicon glyphicon-remove icon-danger btn col-sm-1' aria-hidden='true' onClick={ this.onRemoveBanner.bind(this, card) } />
            </div>);
        });
    }

    render() {
        let banners = this.getBannerList();

        return (
            <div>
                <h4>Either type the cards manually into the box below, add the cards one by one using the card box and autocomplete or for best results, copy and paste a decklist from <a href='http://thronesdb.com' target='_blank'>Thrones DB</a> into the box below.</h4>
                <form className='form form-horizontal'>
                    <Input name='deckName' label='Deck Name' labelClass='col-sm-3' fieldClass='col-sm-9' placeholder='Deck Name'
                        type='text' onChange={ this.onChange.bind(this, 'name') } value={ this.state.deckName } />
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
                    <Typeahead label='Card' labelClass={ 'col-sm-3' } fieldClass='col-sm-4' labelKey={ 'label' } options={ Object.values(this.props.cards) }
                        onChange={ this.addCardChange.bind(this) }>
                        <Input name='numcards' type='text' label='Num' labelClass='col-sm-1' fieldClass='col-sm-2'
                            value={ this.state.numberToAdd.toString() } onChange={ this.onNumberToAddChange.bind(this) }>
                            <div className='col-sm-1'>
                                <button className='btn btn-primary' onClick={ this.onAddCard.bind(this) }>Add</button>
                            </div>
                        </Input>
                    </Typeahead>
                    <TextArea label='Cards' labelClass='col-sm-3' fieldClass='col-sm-9' rows='10' value={ this.state.cardList }
                        onChange={ this.onCardListChange.bind(this) } />
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
    onDeckSave: PropTypes.func,
    onDeckUpdated: PropTypes.func,
    packs: PropTypes.array,
    updateDeck: PropTypes.func
};

function mapStateToProps(state) {
    return {
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

export default connect(mapStateToProps, actions)(DeckEditor);
