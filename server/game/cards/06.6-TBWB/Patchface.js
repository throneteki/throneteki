const DrawCard = require('../../drawcard.js');
const {flatten} = require('../../../Array');

const Icons = ['Military', 'Intrigue', 'Power'];

class Patchface extends DrawCard {
    setupCardAbilities(ability) {
        this.persistentEffect({
            match: this,
            effect: [
                ability.effects.dynamicKeywords(() => this.getFoolKeywords()),
                ability.effects.dynamicIcons(() => this.getFoolIcons())
            ]
        });
    }

    getFoolKeywords() {
        let fools = this.game.filterCardsInPlay(card => card.getType() === 'character' && card.hasTrait('Fool') && card !== this);
        let foolKeywords = [...new Set(flatten(fools.map(card => card.getKeywords())))];
        return foolKeywords;
    }

    getFoolIcons() {
        let foolIcons = [];
        let fools = this.game.filterCardsInPlay(card => card.getType() === 'character' && card.hasTrait('Fool') && card !== this);

        for(let card of fools) {
            for(let icon of Icons) {
                if(card.hasIcon(icon)) {
                    foolIcons.push(icon);
                }
            }
        }

        return foolIcons;
    }
}

Patchface.code = '06107';

module.exports = Patchface;
