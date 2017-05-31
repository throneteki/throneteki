const DrawCard = require('../../../drawcard.js');

class DothrakiSea extends DrawCard {
    setupCardAbilities(ability) {
        this.reaction({
            when: {
                afterChallenge: (event, challenge) => challenge.winner === this.controller && challenge.challengeType === 'power'
            },
            cost: ability.costs.sacrificeSelf(),
            target: {
                activePromptTitle: 'Select Dothraki character to put into play',
                cardCondition: card => card.location === 'hand' && card.getType() === 'character' && card.hasTrait('Dothraki')
            },
            handler: context => {
                context.target.controller.putIntoPlay(context.target);
                this.untilEndOfPhase(ability => ({
                    match: context.target,
                    effect: ability.effects.returnToHandIfStillInPlay()
                }));
                this.game.addMessage('{0} uses {1} to put {2} into play', this.controller, this, context.target);
            }
        });
    }
}

DothrakiSea.code = '01174';

module.exports = DothrakiSea;
