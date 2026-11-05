import DrawCard from '../../drawcard.js';
import GameActions from '../../GameActions/index.js';

class Incinerate extends DrawCard {
    // Incinerate (15024)
    // Action: Choose a participating character and discard 1 or more cards from your hand. Until
    // the end of the challenge, that character gets -2 STR for each card discarded this way.
    setupCardAbilities(ability) {
        this.action({
            title: 'Reduce STR',
            condition: (context) => context.player.hand.some((card) => card !== context.source),
            target: {
                cardCondition: { location: 'play area', type: 'character', participating: true }
            },
            message: '{player} plays {source} to reduce the STR of {target}',
            gameAction: GameActions.chooseCards({
                mode: 'unlimited',
                title: 'Select cards to discard',
                cardCondition: (card, context) =>
                    card.location === 'hand' && card.controller === context.player,
                gameAction: (card) => GameActions.discardCard({ card })
            }).then((preThenContext) => ({
                gameAction: GameActions.lastingEffect((context) => ({
                    duration: 'untilEndOfChallenge',
                    match: context.parentContext.target,
                    effect: ability.effects.modifyStrength(
                        -2 *
                            (preThenContext.chosenCards || []).filter(
                                (card) => card.location === 'discard pile'
                            ).length
                    )
                }))
            }))
        });
    }
}

Incinerate.code = '15024';

export default Incinerate;
