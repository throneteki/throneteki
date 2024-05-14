const DrawCard = require('../../drawcard');

class TheMightOfTheReach extends DrawCard {
    setupCardAbilities() {
        this.action({
            title: 'Give +10 STR to participating character',
            phase: 'challenge',
            target: {
                cardCondition: (card) => card.getType() === 'character' && card.isParticipating()
            },
            handler: (context) => {
                this.game.addMessage(
                    '{0} plays {1} to give +10 STR to {2} until the end of the challenge',
                    context.player,
                    this,
                    context.target
                );
                this.untilEndOfChallenge((ability) => ({
                    match: context.target,
                    effect: ability.effects.modifyStrength(10)
                }));
            }
        });
    }
}

TheMightOfTheReach.code = '11084';

module.exports = TheMightOfTheReach;
