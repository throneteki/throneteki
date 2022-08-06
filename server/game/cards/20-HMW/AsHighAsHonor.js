const DrawCard = require('../../drawcard.js');
const GameActions = require('../../GameActions');

class AsHighAsHonor extends DrawCard {
    setupCardAbilities(ability) {
        this.action({
            title: 'Put card into play',
            phase: 'marshal',
            cost: ability.costs.kneel(card => card.getType() === 'location' && card.isFaction('neutral') && card.getPrintedCost() >= 1),
            target: {
                cardCondition: (card, context) => card.location === 'hand' && card.controller === context.player && card.isFaction('neutral') && context.player.canPutIntoPlay(card)
            },
            message: '{player} plays {source} to put {target} into play from their hand',
            handler: context => {
                this.game.resolveGameAction(
                    GameActions.putIntoPlay(context => ({
                        player: context.player,
                        card: context.target,
                        kneeled: true
                    })).then({
                        condition: context => context.parentContext.target.hasTrait('House Arryn'),
                        message: { format: 'Then {player} stands {originalTarget}', args: { originalTarget: context => context.parentContext.target } },
                        gameAction: GameActions.standCard(context => ({
                            card: context.parentContext.target
                        }))
                    }),
                    context
                );
            }
        });
    }
}

AsHighAsHonor.code = '20049';

module.exports = AsHighAsHonor;
