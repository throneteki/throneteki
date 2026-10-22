import PlotCard from '../../plotcard.js';
import GameActions from '../../GameActions/index.js';

class FuryOfTheKhalasr extends PlotCard {
    // Fury of the Khalasar (15046)
    // Reaction: After the challenges phase begins, put a Dothraki character into play from your
    // hand. At the end of the phase, if that card is still in play, return it to your hand.
    setupCardAbilities(ability) {
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
                GameActions.lastingEffect((context) => ({
                    duration: 'atEndOfPhase',
                    match: context.target,
                    condition: () => ['play area', 'duplicate'].includes(context.target.location),
                    targetLocation: 'any',
                    effect: ability.effects.returnToHandIfStillInPlay(true)
                }))
            ])
        });
    }
}

FuryOfTheKhalasr.code = '15046';

export default FuryOfTheKhalasr;
