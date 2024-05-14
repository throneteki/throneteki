const DrawCard = require('../../drawcard.js');

class CastleBlack extends DrawCard {
    setupCardAbilities(ability) {
        this.action({
            title: 'Stand and give defending character +2 STR',
            condition: () => this.game.isDuringChallenge(),
            cost: ability.costs.kneelSelf(),
            target: {
                cardCondition: (card) =>
                    card.location === 'play area' &&
                    card.getType() === 'character' &&
                    card.isFaction('thenightswatch') &&
                    card.isDefending()
            },
            handler: (context) => {
                context.target.controller.standCard(context.target);
                this.game.addMessage(
                    '{0} kneels {1} to stand and give +2 STR to {2} until the end of the challenge',
                    this.controller,
                    this,
                    context.target
                );

                this.untilEndOfChallenge((ability) => ({
                    match: context.target,
                    effect: ability.effects.modifyStrength(2)
                }));
            }
        });
    }
}

CastleBlack.code = '01136';

module.exports = CastleBlack;
