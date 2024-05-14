const DrawCard = require('../../drawcard.js');

class EliaSand extends DrawCard {
    setupCardAbilities(ability) {
        this.reaction({
            when: {
                afterChallenge: (event) => this.controller === event.challenge.loser
            },
            limit: ability.limit.perPhase(2),
            target: {
                cardCondition: (card) =>
                    card.location === 'play area' && card.getType() === 'character'
            },
            handler: (context) => {
                this.game.addMessage(
                    '{0} uses {1} to give {2} stealth until the end of the phase',
                    this.controller,
                    this,
                    context.target
                );
                this.untilEndOfPhase((ability) => ({
                    match: context.target,
                    effect: ability.effects.addKeyword('Stealth')
                }));
            }
        });
    }
}

EliaSand.code = '04075';

module.exports = EliaSand;
