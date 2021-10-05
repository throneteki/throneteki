import React from 'react';
import PropTypes from 'prop-types';

import Input from '../../Components/Form/Input';
import TextArea from '../../Components/Form/TextArea';
import ApiStatus from '../../Components/Site/ApiStatus';
class DraftCubeEditor extends React.Component {
    constructor(props) {
        super(props);

        let draftCube = Object.assign({
            name: '',
            packDefinitions: [
                { rarities: [] }
            ],
            starterDeck: []
        }, props.draftCube);
        const rarities = draftCube.packDefinitions[0].rarities;
        this.state = {
            draftCubeId: draftCube._id,
            maxPacks: this.calculateMaxPacks(rarities),
            name: draftCube.name,
            rarities: rarities,
            raritiesText: this.formatRaritiesText({ rarities: rarities, cards: props.cards }),
            starterDeck: draftCube.starterDeck,
            starterDeckText: this.formatStarterDeckText({ starterDeck: draftCube.starterDeck, cards: props.cards }),
            totalPerPack: this.calculateTotalperPack(rarities)
        };
    }

    formatRaritiesText({ cards, rarities }) {
        if(!cards || !rarities) {
            return '';
        }

        const allCards = Object.values(cards);
        const cardCodeToNameIndex = allCards.reduce((index, card) => {
            index[card.code] = card.label;
            return index;
        }, {});

        return rarities.map(rarity => {
            const cards = rarity.cards.map(cardQuantity => `${cardQuantity.count}x ${cardCodeToNameIndex[cardQuantity.cardCode]}`);
            return `${rarity.name}: ${rarity.numPerPack}\n${cards.join('\n')}`;
        }).join('\n\n');
    }

    formatStarterDeckText({ cards, starterDeck }) {
        if(!cards || !starterDeck) {
            return '';
        }

        const allCards = Object.values(cards);
        const cardCodeToNameIndex = allCards.reduce((index, card) => {
            index[card.code] = card.label;
            return index;
        }, {});

        return starterDeck.map(cardQuantity => `${cardQuantity.count}x ${cardCodeToNameIndex[cardQuantity.cardCode]}`).join('\n');
    }

    onChange(field, event) {
        let state = this.state;

        state[field] = event.target.value;

        this.setState({ state });
    }

    handleRarityListChange({ event }) {
        const raritySections = event.target.value.trim().split(/\n\n+/);
        const rarities = [];

        for(const raritySection of raritySections) {
            const lines = raritySection.split('\n');
            if(lines.length === 0) {
                continue;
            }

            const rarityDefinition = lines[0];

            if(!rarityDefinition.includes(':')) {
                continue;
            }

            const rarity = {
                name: rarityDefinition.split(':')[0].trim(),
                numPerPack: parseInt(rarityDefinition.split(':')[1].trim()) || 0,
                cards: []
            };
            for(const line of lines.slice(1)) {
                const cardQuantity = this.parseCardQuantityLine(line);
                if(cardQuantity.count > 0) {
                    rarity.cards.push(cardQuantity);
                }
            }

            rarities.push(rarity);
        }

        this.setState({
            maxPacks: this.calculateMaxPacks(rarities),
            raritiesText: event.target.value,
            rarities,
            totalPerPack: this.calculateTotalperPack(rarities)
        });
    }

    calculateTotalperPack(rarities) {
        return rarities.reduce((total, rarity) => total + rarity.numPerPack, 0);
    }

    calculateMaxPacks(rarities) {
        const maxPacksPerRarity = rarities.map(rarity => {
            if(rarity.numPerPack === 0) {
                return 0;
            }

            const totalCards = rarity.cards.reduce((total, cardQuantity) => total + cardQuantity.count, 0);

            return Math.floor(totalCards / rarity.numPerPack);
        });
        return Math.min(...maxPacksPerRarity);
    }

    handleStarterDeckChange({ event }) {
        const cardLines = event.target.value.split(/\n+/);
        const starterDeck = [];

        for(const cardLine of cardLines) {
            const cardQuantity = this.parseCardQuantityLine(cardLine);
            if(cardQuantity.count > 0) {
                starterDeck.push(cardQuantity);
            }
        }

        this.setState({
            starterDeck,
            starterDeckText: event.target.value
        });
    }

    parseCardQuantityLine(line) {
        const pattern = /^(\d+)x?\s+(.+)$/;

        let match = line.trim().match(pattern);
        if(!match) {
            return { count: 0 };
        }

        let count = parseInt(match[1]);
        let card = this.parseCardLine(match[2]);

        if(!card) {
            return { count: 0 };
        }

        return { count: count, cardCode: card.code };
    }

    parseCardLine(line) {
        const pattern = /^([^()]+)(\s+\((.+)\))?$/;

        let match = line.trim().match(pattern);
        if(!match) {
            return null;
        }

        let cardName = match[1].trim().toLowerCase();
        let packName = match[3] && match[3].trim().toLowerCase();
        let pack = packName && this.props.packs.find(pack => pack.code.toLowerCase() === packName || pack.name.toLowerCase() === packName);
        let cards = Object.values(this.props.cards);

        let matchingCards = cards.filter(card => {
            if(pack) {
                return pack.code === card.packCode && card.name.toLowerCase() === cardName;
            }

            return card.name.toLowerCase() === cardName;
        });

        matchingCards.sort((a, b) => this.compareCardByReleaseDate(a, b));

        return matchingCards[0];
    }

    compareCardByReleaseDate(a, b) {
        let packA = this.props.packs.find(pack => pack.code === a.packCode);
        let packB = this.props.packs.find(pack => pack.code === b.packCode);

        if(!packA.releaseDate && packB.releaseDate) {
            return 1;
        }

        if(!packB.releaseDate && packA.releaseDate) {
            return -1;
        }

        return new Date(packA.releaseDate) < new Date(packB.releaseDate) ? -1 : 1;
    }

    handleSaveClick(event) {
        event.preventDefault();

        if(this.props.onDraftCubeSave) {
            this.props.onDraftCubeSave(this.getDraftCubeFromState());
        }
    }

    getDraftCubeFromState() {
        return {
            _id: this.state.draftCubeId,
            name: this.state.name,
            packDefinitions: [
                {
                    rarities: this.state.rarities
                }
            ],
            starterDeck: this.state.starterDeck
        };
    }

    handleCancelClick() {
        this.props.navigate('/events');
    }

    render() {
        return (
            <div>
                <ApiStatus apiState={ this.props.apiState } successMessage='Cube saved successfully.' />

                <form className='form form-horizontal'>
                    <Input name='name' label='Cube Name' labelClass='col-sm-3' fieldClass='col-sm-9' placeholder='Cube Name'
                        type='text' onChange={ this.onChange.bind(this, 'name') } value={ this.state.name } />
                    <div className='form-group'>
                        <div className='control-label col-sm-3' />
                        <div className='col-sm-9'>
                            <strong>{ `Max ${this.state.maxPacks} packs of ${this.state.totalPerPack} cards` }</strong>
                        </div>
                    </div>
                    <TextArea
                        label='Card Rarities'
                        labelClass='col-sm-3'
                        fieldClass='col-sm-9'
                        rows='10'
                        value={ this.state.raritiesText }
                        onChange={ event => this.handleRarityListChange({ event }) } />
                    <TextArea
                        label='Starter Deck'
                        labelClass='col-sm-3'
                        fieldClass='col-sm-9'
                        rows='10'
                        value={ this.state.starterDeckText }
                        onChange={ event => this.handleStarterDeckChange({ event }) } />

                    <div className='form-group'>
                        <div className='col-sm-offset-3 col-sm-8'>
                            <button ref='submit' type='submit' className='btn btn-primary' onClick={ this.handleSaveClick.bind(this) }>Save { this.props.apiState && this.props.apiState.loading && <span className='spinner button-spinner' /> }</button>
                            <button ref='submit' type='button' className='btn btn-primary' onClick={ this.handleCancelClick.bind(this) }>Cancel</button>
                        </div>
                    </div>
                </form>
            </div>
        );
    }
}

DraftCubeEditor.displayName = 'DraftCubeEditor';
DraftCubeEditor.propTypes = {
    apiState: PropTypes.object,
    cards: PropTypes.object,
    draftCube: PropTypes.object,
    navigate: PropTypes.func,
    onDraftCubeSave: PropTypes.func,
    packs: PropTypes.array
};

export default DraftCubeEditor;
