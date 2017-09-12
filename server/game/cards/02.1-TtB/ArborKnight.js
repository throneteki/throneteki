const DrawCard = require('../../drawcard.js');

class ArborKnight extends DrawCard {
    setupCardAbilities(ability) {
        this.action({
            title: 'Give a character +1 STR',
            limit: ability.limit.perPhase(3),
            condition: () => this.game.currentChallenge,
            cost: ability.costs.payGold(1),
            target: {
                cardCondition: card => card.location === 'play area' && card.getType() === 'character' && card.hasTrait('House Redwyne') && this.game.currentChallenge.isParticipating(card)
            },
            handler: context => {
                this.game.addMessage('{0} uses {1} to pay 1 gold and give {2} +1 STR until the end of the challenge', this.controller, this, context.target);
                this.untilEndOfChallenge(ability => ({
                    match: context.target,
                    effect: ability.effects.modifyStrength(1)
                }));
            }
        });
    }
}

ArborKnight.code = '02005';

module.exports = ArborKnight;
