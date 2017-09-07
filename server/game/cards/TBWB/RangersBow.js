const DrawCard = require('../../drawcard.js');

class RangersBow extends DrawCard {
    setupCardAbilities(ability) {
        this.whileAttached({
            effect: ability.effects.modifyStrength(1)
        });

        this.action({
            title: 'Give defending character +2 STR',
            condition: () => this.game.currentChallenge,
            cost: ability.costs.kneelSelf(),
            target: {
                cardCondition: card => card.isFaction('thenightswatch') && card.getType() === 'character' && this.game.currentChallenge.isDefending(card)
            },
            handler: context => {
                this.untilEndOfChallenge(ability => ({
                    match: context.target,
                    effect: ability.effects.modifyStrength(2)
                }));

                this.game.addMessage('{0} kneels {1} to give {2} +2 STR until the end of the challenge', this.controller, this, context.target);
            }
        });
    }

    canAttach(player, card) {
        if(card.getType() !== 'character' || !card.isFaction('thenightswatch')) {
            return false;
        }

        return super.canAttach(player, card);
    }
}

RangersBow.code = '06106';

module.exports = RangersBow;
