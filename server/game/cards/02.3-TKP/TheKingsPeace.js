import PlotCard from '../../plotcard.js';
import GameActions from '../../GameActions/index.js';

class TheKingsPeace extends PlotCard {
    // The King's Peace (02048)
    // Reaction: After a [military] or [power] challenge is initiated against you, the attacking
    // player may either: kneel his or her faction card, or move 1 power from that faction card to
    // yours. If that player does not, the challenge immediately ends with no winner or loser.
    setupCardAbilities() {
        this.reaction({
            when: {
                onChallengeInitiated: (event, context) =>
                    event.challenge.initiatedAgainstPlayer === context.player &&
                    (event.challenge.initiatedChallengeType === 'military' ||
                        event.challenge.initiatedChallengeType === 'power')
            },
            message: {
                format: "{player} uses {source} to force {attackingPlayer} to kneel their faction card, move 1 power to {player}'s faction card or cancel the challenge",
                args: { attackingPlayer: (context) => context.event.challenge.attackingPlayer }
            },
            gameAction: GameActions.ifCondition({
                condition: (context) =>
                    canKneel(attackingFaction(context)) || attackingFaction(context).power >= 1,
                thenAction: GameActions.choose({
                    player: (context) => context.event.challenge.attackingPlayer,
                    title: (context) => `Select choice for ${context.source.name}`,
                    choices: {
                        'Kneel faction card': {
                            condition: (context) => canKneel(attackingFaction(context)),
                            message:
                                '{choosingPlayer} chooses to kneel their faction card to let the challenge continue',
                            gameAction: GameActions.kneelCard((context) => ({
                                card: attackingFaction(context)
                            }))
                        },
                        'Move 1 power': {
                            condition: (context) => attackingFaction(context).power >= 1,
                            message:
                                "{choosingPlayer} chooses to move 1 power to {player}'s faction card to let the challenge continue",
                            gameAction: GameActions.movePower((context) => ({
                                from: attackingFaction(context),
                                to: context.player.faction,
                                amount: 1
                            }))
                        },
                        'Cancel Challenge': endChallenge()
                    }
                }),
                elseAction: endChallenge()
            })
        });
    }
}

function attackingFaction(context) {
    return context.event.challenge.attackingPlayer.faction;
}

function canKneel(faction) {
    return !faction.kneeled;
}

function endChallenge() {
    return {
        message: '{player} uses {source} to cancel the current challenge',
        gameAction: GameActions.endChallenge((context) => ({ challenge: context.event.challenge }))
    };
}

TheKingsPeace.code = '02048';

export default TheKingsPeace;
