const DrawCard = require('../../drawcard.js');

class ArborMarket extends DrawCard {
    setupCardAbilities(ability) {
        this.plotModifiers({
            gold: 1
        });

        this.action({
            title: 'Give character +1 STR',
            cost: ability.costs.kneelSelf(),
            condition: () => this.game.isDuringChallenge(),
            phase: 'challenge',

            target: {
                cardCondition: (card) => card.location === 'play area' && card.isParticipating()
            },
            handler: (context) => {
                this.game.addMessage(
                    '{0} kneels {1} to give +1 STR to {2} until the end of the challenge',
                    this.controller,
                    this,
                    context.target
                );

                this.untilEndOfChallenge((ability) => ({
                    match: context.target,
                    effect: ability.effects.modifyStrength(1)
                }));
            }
        });
    }
}

ArborMarket.code = '11104';

module.exports = ArborMarket;
