const DrawCard = require('../../drawcard.js');

class RaidingLongship extends DrawCard {
    setupCardAbilities(ability) {
        this.action({
            title: 'Remove character\'s STR from challenge',
            condition: () => this.game.currentChallenge && this.controller.firstPlayer,
            cost: ability.costs.kneelSelf(),
            target: {
                cardCondition: card => card.getType() === 'character' && card.location === 'play area' &&
                                       this.game.currentChallenge.isDefending(card) && card.attachments.size() === 0
            },
            handler: context => {
                this.untilEndOfChallenge(ability => ({
                    match: context.target,
                    effect: ability.effects.doesNotContributeStrength()
                }));

                this.game.addMessage('{0} kneels {1} to remove {2}\'s STR from the challenge',
                    this.controller, this, context.target);
            }
        });
    }
}

RaidingLongship.code = '02032';

module.exports = RaidingLongship;
