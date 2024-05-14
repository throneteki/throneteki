const PlotCard = require('../../plotcard');

class TheCrone extends PlotCard {
    setupCardAbilities(ability) {
        this.persistentEffect({
            match: (card) =>
                card.location === 'play area' &&
                card.getType() === 'character' &&
                card.getPrintedStrength() <= 1,
            targetController: 'any',
            effect: [
                ability.effects.cannotBeKilled(),
                ability.effects.cannotBeDiscarded(),
                ability.effects.cannotBePutIntoShadows(),
                ability.effects.cannotBeRemovedFromGame(),
                ability.effects.cannotBeReturnedToHand(),
                ability.effects.cannotBeSacrificed(),
                ability.effects.cannotBeReturnedToDeck()
            ]
        });
    }
}

TheCrone.code = '20053';

module.exports = TheCrone;
