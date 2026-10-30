import DrawCard from '../../drawcard.js';
import GameActions from '../../GameActions/index.js';

class WakingTheDragon extends DrawCard {
    // Waking the Dragon (01178)
    // Action: Choose and stand a unique [targaryen] character you control. At the end of the phase,
    // if that character is still in play, return it to your hand.
    setupCardAbilities() {
        this.action({
            title: 'Stand a character',
            target: {
                cardCondition: (card, context) =>
                    card.location === 'play area' &&
                    card.getType() === 'character' &&
                    card.isFaction('targaryen') &&
                    card.isUnique() &&
                    card.controller === context.player
            },
            message: '{player} plays {source} to stand {target}',
            gameAction: GameActions.simultaneously([
                GameActions.standCard((context) => ({ card: context.target })),
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
                                gameAction: GameActions.returnCardToHand({ card, allowSave: true })
                            }
                        })
                    };
                })
            ])
        });
    }
}

WakingTheDragon.code = '01178';

export default WakingTheDragon;
