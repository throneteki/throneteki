const DrawCard = require('../../drawcard.js');
const GameActions = require('../../GameActions');

class FleaBottomAlley extends DrawCard {
    setupCardAbilities(ability) {
        this.action({
            title: 'Put character into play',
            phase: 'marshal',
            target: {
                cardCondition: (card, context) =>
                    card.location === 'hand' &&
                    card.controller === context.player &&
                    card.isFaction('thenightswatch') &&
                    card.getType() === 'character' &&
                    card.getPrintedCost() <= 3 &&
                    context.player.canPutIntoPlay(card)
            },
            cost: [ability.costs.kneelSelf(), ability.costs.sacrificeSelf()],
            message: '{player} kneels and sacrifices {source} to put {target} into play',
            handler: (context) => {
                this.game.resolveGameAction(
                    GameActions.putIntoPlay((context) => ({
                        player: context.player,
                        card: context.target
                    })).then({
                        message: 'Then {player} draws 1 card',
                        gameAction: GameActions.drawCards((context) => ({
                            player: context.player,
                            amount: 1
                        }))
                    }),
                    context
                );
            }
        });
    }
}

FleaBottomAlley.code = '13006';

module.exports = FleaBottomAlley;
