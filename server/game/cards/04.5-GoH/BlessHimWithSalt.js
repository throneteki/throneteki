import DrawCard from '../../drawcard.js';
import GameActions from '../../GameActions/index.js';

class BlessHimWithSalt extends DrawCard {
    // Bless Him With Salt (04092)
    // Play only during a [power] challenge.
    // Action: Choose a participating Drowned God or Ironborn character. Until the end of the
    // challenge, that character gets +3 STR. If you win the challenge, draw 1 card.
    setupCardAbilities(ability) {
        this.action({
            title: 'Give +3 STR to character',
            condition: (context) => context.game.isDuringChallenge({ challengeType: 'power' }),
            target: {
                activePromptTitle: 'Select character',
                cardCondition: (card) =>
                    card.isParticipating() &&
                    (card.hasTrait('Drowned God') || card.hasTrait('Ironborn'))
            },
            message: '{player} uses {source} to give +3 STR to {target}',
            gameAction: GameActions.simultaneously([
                GameActions.lastingEffect((context) => ({
                    duration: 'untilEndOfChallenge',
                    match: context.target,
                    effect: ability.effects.modifyStrength(3)
                })),
                GameActions.delayedEffect({
                    duration: 'untilEndOfChallenge',
                    when: {
                        afterChallenge: (event, context) =>
                            event.challenge.winner === context.player
                    },
                    message: '{player} uses {source} to draw 1 card',
                    gameAction: GameActions.drawCards((context) => ({
                        player: context.player,
                        amount: 1
                    }))
                })
            ])
        });
    }
}

BlessHimWithSalt.code = '04092';

export default BlessHimWithSalt;
