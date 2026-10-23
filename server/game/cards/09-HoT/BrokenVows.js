import DrawCard from '../../drawcard.js';
import GameActions from '../../GameActions/index.js';

class BrokenVows extends DrawCard {
    // Broken Vows (09034)
    // Marshaling Action: Give control of a [thenightswatch] character you control to an opponent.
    // Then, take control of a non-loyal character that player controls with a lower printed cost.
    setupCardAbilities() {
        this.action({
            title: 'Exchange characters',
            phase: 'marshal',
            chooseOpponent: () => true,
            target: {
                type: 'select',
                cardCondition: (card, context) =>
                    card.location === 'play area' &&
                    card.getType() === 'character' &&
                    card.controller === context.player &&
                    card.isFaction('thenightswatch')
            },
            message: '{player} plays {source} to give control of {target} to {opponent}',
            gameAction: GameActions.takeControl((context) => ({
                player: context.opponent,
                card: context.target
            })).then({
                target: {
                    type: 'select',
                    cardCondition: (card, context) =>
                        card.location === 'play area' &&
                        card.getType() === 'character' &&
                        card.controller === context.parentContext.opponent &&
                        card.getPrintedCost() < context.parentContext.target.getPrintedCost() &&
                        !card.isLoyal() &&
                        context.player.canControl(card)
                },
                message: 'Then {player} takes control of {target}',
                gameAction: GameActions.takeControl((context) => ({
                    player: context.player,
                    card: context.target
                }))
            })
        });
    }
}

BrokenVows.code = '09034';

export default BrokenVows;
