const GameActions = require('../../GameActions');
const PlotCard = require('../../plotcard');

class BattleOfTheCamps extends PlotCard {
    setupCardAbilities() {
        this.reaction({
            when: {
                afterChallenge: event => event.challenge.challengeType === 'military' && event.challenge.attackingPlayer === this.controller
            },
            target: {
                cardCondition: { type: 'character', location: 'play area', conditon: (card, context) => card.controller === context.event.challenge.loser }
            },
            handler: context => {
                this.game.resolveGameAction(GameActions.ifCondition({
                    condition: context => context.target.hasTrait('Army'),
                    thenAction: GameActions.kill(context => ({ card: context.target })),
                    elseAction: GameActions.kneelCard(context => ({ card: context.target }))
                }), context);
            }
        });
    }
}

BattleOfTheCamps.code = '24030';

module.exports = BattleOfTheCamps;
