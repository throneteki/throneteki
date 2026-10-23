import DrawCard from '../../drawcard.js';
import GameActions from '../../GameActions/index.js';
import PaidGoldTracker from '../../EventTrackers/PaidGoldTracker.js';

class BrothelMadame extends DrawCard {
    // Brothel Madame (02029)
    // Reaction: After the challenges phase begins, choose a player. That player may give you 1 gold
    // from his or her gold pool. Until the end of the phase, if that player has not given you gold
    // this phase, he or she cannot initiate [military] challenges against you.
    setupCardAbilities(ability) {
        this.tracker = new PaidGoldTracker(this.game);

        this.reaction({
            when: {
                onPhaseStarted: (event) => event.phase === 'challenge'
            },
            chooseOpponent: (opponent, context) =>
                !context.source.tracker.hasPaid(opponent, context.player),
            message:
                '{player} uses {source} to have {opponent} give them 1 gold or be unable to initiate military challenges against them this phase',
            gameAction: GameActions.simultaneously([
                GameActions.lastingEffect((context) => ({
                    duration: 'untilEndOfPhase',
                    targetController: context.opponent,
                    condition: () =>
                        !context.source.tracker.hasPaid(context.opponent, context.player),
                    effect: ability.effects.cannotInitiateChallengeType(
                        'military',
                        (opponent) => opponent === context.player
                    )
                })),
                GameActions.may({
                    player: (context) => context.opponent,
                    title: 'Pay 1 gold to initiate military challenges this phase?',
                    message: '{choosingPlayer} gives {player} 1 gold for {source}',
                    gameAction: GameActions.transferGold((context) => ({
                        from: context.opponent,
                        to: context.player,
                        amount: 1
                    }))
                })
            ])
        });
    }
}

BrothelMadame.code = '02029';

export default BrothelMadame;
