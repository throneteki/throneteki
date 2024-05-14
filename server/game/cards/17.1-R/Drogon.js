const DrawCard = require('../../drawcard.js');

class Drogon extends DrawCard {
    setupCardAbilities() {
        this.reaction({
            when: {
                afterChallenge: (event) =>
                    event.challenge.winner === this.controller && this.isAttacking()
            },
            target: {
                cardCondition: (card) =>
                    card.location === 'play area' &&
                    card.controller === this.game.currentChallenge.loser &&
                    card.getType() === 'character' &&
                    card.attachments.length === 0
            },
            handler: (context) => {
                this.untilEndOfPhase((ability) => ({
                    match: context.target,
                    effect: ability.effects.killByStrength(-3)
                }));

                this.game.addMessage(
                    '{0} uses {1} to give {2} -3 STR until the end of the phase',
                    context.player,
                    this,
                    context.target
                );
            }
        });
    }
}

Drogon.code = '17129';

module.exports = Drogon;
