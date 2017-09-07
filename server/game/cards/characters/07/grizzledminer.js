const DrawCard = require('../../../drawcard.js');

class GrizzledMiner extends DrawCard {

    setupCardAbilities(ability) {
        this.persistentEffect({
            location: 'any',
            targetType: 'player',
            targetController: 'current',
            effect: [
                ability.effects.reduceSelfCost('marshal', () => this.getDiscount()),
                ability.effects.setMinCost(1)
            ]
        });
    }

    getDiscount() {
        let cards = this.controller.filterCardsInPlay(
            card => card.isFaction('thenightswatch')
                && (card.getType() === 'attachment' || card.getType() === 'location'));

        return cards.length;
    }

}

GrizzledMiner.code = '07006';

module.exports = GrizzledMiner;
