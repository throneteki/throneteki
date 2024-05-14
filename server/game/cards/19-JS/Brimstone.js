const DrawCard = require('../../drawcard.js');

class Brimstone extends DrawCard {
    setupCardAbilities(ability) {
        this.persistentEffect({
            match: (card) =>
                card.getType() === 'character' &&
                card.controller === this.controller &&
                card.hasTrait('Sand Snake'),
            effect: ability.effects.modifyStrength(1)
        });

        this.action({
            title: 'Return Sand Snake',
            phase: 'challenge',
            cost: [
                ability.costs.kneelSelf(),
                ability.costs.returnToHand(
                    (card) => card.getType() === 'character' && card.hasTrait('Sand Snake')
                )
            ],
            handler: (context) => {
                this.game.addGold(context.player, 1);
                this.game.addMessage(
                    '{0} kneels {1} and returns {2} to their hand to gain 1 gold',
                    context.player,
                    this,
                    context.costs.returnToHand
                );
            }
        });
    }
}

Brimstone.code = '19008';

module.exports = Brimstone;
