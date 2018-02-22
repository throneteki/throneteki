const DrawCard = require('../../drawcard.js');

class DothrakiSea extends DrawCard {
    setupCardAbilities(ability) {
        this.reaction({
            when: {
                afterChallenge: event => event.challenge.winner === this.controller && event.challenge.challengeType === 'power'
            },
            cost: ability.costs.sacrificeSelf(),
            target: {
                cardCondition: (card, context) => card.location === 'hand' && card.getType() === 'character' &&
                                                  card.controller === context.player && card.hasTrait('Dothraki') &&
                                                  context.player.canPutIntoPlay(card)
            },
            handler: context => {
                context.target.controller.putIntoPlay(context.target);
                this.untilEndOfPhase(ability => ({
                    match: context.target,
                    effect: ability.effects.returnToHandIfStillInPlay()
                }));
                this.game.addMessage('{0} sacrifices {1} to put {2} into play from their hand', this.controller, this, context.target);
            }
        });
    }
}

DothrakiSea.code = '01174';

module.exports = DothrakiSea;
