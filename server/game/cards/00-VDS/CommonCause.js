const PlotCard = require('../../plotcard.js');

class CommonCause extends PlotCard {
    setupCardAbilities(ability) {
        this.persistentEffect({
            match: this,
            effect: ability.effects.modifyClaim(() => this.getNumberOfFactions())
        });
    }

    getNumberOfFactions() {
        let charactersInPlay = this.controller.filterCardsInPlay(
            (card) => card.getType() === 'character' && !card.isFaction('neutral')
        );
        let factionsInPlay = [];

        for (let card of charactersInPlay) {
            let factions = card.getFactions();
            for (let faction of factions) {
                if (!factionsInPlay.includes(faction)) {
                    factionsInPlay.push(faction);
                }
            }
        }

        return factionsInPlay.length;
    }
}

CommonCause.code = '00021';

module.exports = CommonCause;
