const DrawCard = require('../../drawcard.js');

class MolesTown extends DrawCard {
    setupCardAbilities(ability) {
        this.action({
            title: 'Move gold to character',
            condition: () => this.hasToken('gold'),
            cost: ability.costs.kneelSelf(),
            target: {
                cardCondition: card => card.location === 'play area' && card.getType() === 'character' && !card.hasToken('gold')
            },
            handler: context => {
                this.modifyToken('gold', -1);
                context.target.modifyToken('gold', 1);
                this.game.addMessage('{0} kneels {1} to move 1 gold to {2}', context.player, this, context.target);

                this.untilEndOfPhase(ability => ({
                    match: context.target,
                    effect: ability.effects.cannotBeDeclaredAsAttacker()
                }));

                this.game.addMessage('{0} cannot be declared as an attacker until the end of the phase', context.target);
            }
        });
    }
}

MolesTown.code = '08046';

module.exports = MolesTown;
