import DrawCard from '../../drawcard.js';
import GameActions from '../../GameActions/index.js';

class TheStarrySept extends DrawCard {
    // The Starry Sept (12042)
    // Action: Move 1 power from The Starry Sept to a character. Until the end of the phase, treat
    // that character as if its printed text box were blank (except for Traits).
    // Reaction: After you win a [power] challenge, The Starry Sept gains 1 power.
    setupCardAbilities(ability) {
        this.action({
            title: 'Move 1 power + blank',
            condition: (context) => context.source.power > 0,
            target: {
                cardCondition: (card) =>
                    card.getType() === 'character' && card.location === 'play area'
            },
            message:
                '{player} uses {source} to move 1 power to {target} and blank them until the end of the phase',
            gameAction: GameActions.simultaneously([
                GameActions.movePower((context) => ({
                    from: context.source,
                    to: context.target,
                    amount: 1
                })),
                GameActions.lastingEffect((context) => ({
                    duration: 'untilEndOfPhase',
                    match: context.target,
                    effect: ability.effects.blankExcludingTraits
                }))
            ])
        });

        this.reaction({
            when: {
                afterChallenge: (event, context) =>
                    event.challenge.isMatch({
                        winner: context.source.controller,
                        challengeType: 'power'
                    }) && context.source.canGainPower()
            },
            message: '{player} uses {source} to have {source} gain 1 power',
            gameAction: GameActions.gainPower((context) => ({ card: context.source, amount: 1 }))
        });
    }
}

TheStarrySept.code = '12042';

export default TheStarrySept;
