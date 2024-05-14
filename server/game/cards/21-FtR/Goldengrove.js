const DrawCard = require('../../drawcard.js');
const GameActions = require('../../GameActions');

class Goldengrove extends DrawCard {
    setupCardAbilities(ability) {
        this.action({
            title: 'Stand and take control',
            limit: ability.limit.perRound(2),
            cost: ability.costs.kneel(
                (card) =>
                    card === this ||
                    (card.hasTrait('Small Council') && card.getType() === 'character')
            ),
            target: {
                cardCondition: (card, context) =>
                    card.location === 'play area' &&
                    card.owner === context.player &&
                    (!context.costs.kneel ||
                        (card !== context.costs.kneel &&
                            card.getPrintedCost() <= context.costs.kneel.getPrintedCost()))
            },
            message: {
                format: '{player} uses {source} and kneels {kneltCard} to stand and take control of {target}',
                args: { kneltCard: (context) => context.costs.kneel }
            },
            handler: (context) => {
                let gameActions = [];
                gameActions.push(GameActions.standCard({ card: context.target }));
                gameActions.push(
                    GameActions.takeControl((context) => ({
                        player: context.player,
                        card: context.target
                    }))
                );
                this.game.resolveGameAction(GameActions.simultaneously(gameActions), context);
            }
        });
    }
}

Goldengrove.code = '21024';

module.exports = Goldengrove;
