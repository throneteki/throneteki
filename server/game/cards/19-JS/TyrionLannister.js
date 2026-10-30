import DrawCard from '../../drawcard.js';
import GameActions from '../../GameActions/index.js';

class TyrionLannister extends DrawCard {
    // Tyrion Lannister (19014)
    // Bestow (3). Stealth.
    // Action: Discard 1 gold from Tyrion Lannister to put a Mercenary character into play under
    // your control from any player’s discard pile. At the end of the phase, if that card is still
    // in play, place it on the bottom of its owner's deck. (Limit once per phase.)
    setupCardAbilities(ability) {
        this.action({
            title: 'Put Mercenary into play',
            limit: ability.limit.perPhase(1),
            cost: ability.costs.discardGold(),
            target: {
                cardCondition: (card, context) =>
                    card.location === 'discard pile' &&
                    card.getType() === 'character' &&
                    card.hasTrait('Mercenary') &&
                    context.player.canPutIntoPlay(card)
            },
            message: {
                format: "{player} discards 1 gold from {source} to put {target} into play from {owner}'s discard pile under their control",
                args: { owner: (context) => context.target.owner }
            },
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

TyrionLannister.code = '19014';

export default TyrionLannister;
