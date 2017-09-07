const _ = require('underscore');

const PlotCard = require('../../plotcard.js');

class CommonCause extends PlotCard {
    setupCardAbilities(ability) {
        this.persistentEffect({
            match: this,
            effect: ability.effects.dynamicClaim(() => this.getNumberOfFactions())
        });
    }

    getNumberOfFactions() {
        let charactersInPlay = this.controller.filterCardsInPlay(card => card.getType() === 'character' && !card.isFaction('neutral'));
        let factionsInPlay = [];

        _.each(charactersInPlay, card => {
            let factions = card.getFactions();
            _.each(factions, faction => {
                if(!factionsInPlay.includes(faction)) {
                    factionsInPlay.push(faction);
                }
            });
        });

        return factionsInPlay.length;
    }
}

CommonCause.code = '00021';

module.exports = CommonCause;
