import PlotCard from '../../plotcard.js';
import GameActions from '../../GameActions/index.js';

class FuryOfTheKhalasr extends PlotCard {
    // Fury of the Khalasar (15046)
    // Reaction: After the challenges phase begins, put a Dothraki character into play from your
    // hand. At the end of the phase, if that card is still in play, return it to your hand.
    setupCardAbilities() {
        this.reaction({
            when: {
                onPhaseStarted: (event) => event.phase === 'challenge'
            },
            target: {
                type: 'select',
                cardCondition: (card, context) =>
                    card.isMatch({
                        controller: context.player,
                        location: 'hand',
                        trait: 'Dothraki',
                        type: 'character'
                    }) && context.player.canPutIntoPlay(card)
            },
            message: '{player} uses {source} to put {target} into play',
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
                                gameAction: GameActions.returnCardToHand({ card, allowSave: true })
                            }
                        })
                    };
                })
            ])
        });
    }
}

FuryOfTheKhalasr.code = '15046';

export default FuryOfTheKhalasr;
