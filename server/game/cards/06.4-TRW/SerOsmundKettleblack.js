import DrawCard from '../../drawcard.js';
import GameActions from '../../GameActions/index.js';

class SerOsmundKettleblack extends DrawCard {
    // Ser Osmund Kettleblack (06069)
    // Bestow (3).
    // Challenges Action: Discard 1 gold from Ser Osmund Kettleblack to put a Knight character into
    // play from your hand. At the end of the phase, if that card is still in play, discard it from
    // play (cannot be saved). (Limit once per phase.)
    setupCardAbilities(ability) {
        this.action({
            title: 'Put Knight into play',
            limit: ability.limit.perPhase(1),
            phase: 'challenge',
            cost: ability.costs.discardGold(),
            target: {
                cardCondition: (card, context) =>
                    card.location === 'hand' &&
                    card.controller === context.source.controller &&
                    card.getType() === 'character' &&
                    card.hasTrait('Knight') &&
                    context.source.controller.canPutIntoPlay(card)
            },
            message:
                '{player} discards 1 gold from {source} to put {target} into play from their hand',
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
                                gameAction: GameActions.discardCard({ card, allowSave: false })
                            }
                        })
                    };
                })
            ])
        });
    }
}

SerOsmundKettleblack.code = '06069';

export default SerOsmundKettleblack;
