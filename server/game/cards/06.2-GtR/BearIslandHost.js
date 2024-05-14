const DrawCard = require('../../drawcard.js');

class BearIslandHost extends DrawCard {
    setupCardAbilities(ability) {
        this.action({
            title: 'Discard 1 gold from ' + this.name,
            cost: ability.costs.discardGold(),
            target: {
                cardCondition: (card) =>
                    card.location === 'play area' &&
                    card.hasTrait('House Mormont') &&
                    card.getType() === 'character'
            },
            handler: (context) => {
                this.untilEndOfPhase((ability) => ({
                    match: context.target,
                    effect: ability.effects.doesNotKneelAsAttacker({ challengeType: 'military' })
                }));

                this.game.addMessage(
                    '{0} discards a gold from {1} to make {2} not kneel as an attacker in a military challenge',
                    this.controller,
                    this,
                    context.target
                );
            }
        });
    }
}

BearIslandHost.code = '06021';

module.exports = BearIslandHost;
