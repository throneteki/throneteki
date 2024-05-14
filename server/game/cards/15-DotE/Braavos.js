const DrawCard = require('../../drawcard.js');

class Braavos extends DrawCard {
    setupCardAbilities(ability) {
        this.action({
            title: 'Gain gold',
            phase: 'marshal',
            condition: () => this.controller.canGainGold(),
            cost: ability.costs.kneelSelf(),
            handler: () => {
                const goldGained = this.game.addGold(this.controller, this.getNumberOfFactions());
                this.game.addMessage(
                    '{0} kneels {1} to gain {2} gold',
                    this.controller,
                    this,
                    goldGained
                );
            }
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

Braavos.code = '15042';

module.exports = Braavos;
