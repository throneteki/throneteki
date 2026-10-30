import DrawCard from '../../drawcard.js';
import GameActions from '../../GameActions/index.js';

class FleaBottom extends DrawCard {
    // Flea Bottom (17142)
    // Bestow (3).
    // Challenges Action: Kneel Flea Bottom and discard 1 gold from it to put a character with
    // printed cost 3 or lower into play from your discard pile. At the end of the phase, if that
    // card is still in play, place it on the bottom of your deck.
    setupCardAbilities(ability) {
        this.action({
            title: 'Put character into play',
            phase: 'challenge',
            target: {
                cardCondition: (card, context) =>
                    card.location === 'discard pile' &&
                    card.controller === context.source.controller &&
                    card.getType() === 'character' &&
                    card.getPrintedCost() <= 3 &&
                    context.source.controller.canPutIntoPlay(card)
            },
            cost: [ability.costs.discardGold(), ability.costs.kneelSelf()],
            message:
                '{player} discards 1 gold from {source} and kneels it to put {target} into play from their discard pile',
            gameAction: GameActions.simultaneously([
                GameActions.putIntoPlay((context) => ({
                    player: context.player,
                    card: context.target
                })),
                GameActions.delayedEffect((context) => {
                    const card = context.target;
                    return {
                        duration: 'untilTriggered',
                        title: card.name,
                        when: { onAtEndOfPhase: () => true },
                        until: { onCardLeftPlay: (event) => event.card === card },
                        gameAction: GameActions.ifCondition({
                            condition: () => ['play area', 'duplicate'].includes(card.location),
                            thenAction: {
                                message:
                                    '{player} resolves the delayed effect from {source}: {gameAction}',
                                gameAction: GameActions.returnCardToDeck({
                                    card,
                                    bottom: true,
                                    allowSave: true
                                })
                            }
                        })
                    };
                })
            ])
        });
    }
}

FleaBottom.code = '17142';

export default FleaBottom;
