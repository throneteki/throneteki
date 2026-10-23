import DrawCard from '../../drawcard.js';
import GameActions from '../../GameActions/index.js';

class DornishRevenge extends DrawCard {
    // Dornish Revenge (06096)
    // Reaction: After you initiate a challenge, choose a character controlled by the defending
    // player. That character must be declared as a defender for this challenge, if able. If you win
    // this challenge by 5 or more STR, the losing opponent must choose and kill a defending
    // character.
    setupCardAbilities(ability) {
        this.reaction({
            when: {
                onChallengeInitiated: (event, context) =>
                    event.challenge.attackingPlayer === context.player
            },
            target: {
                cardCondition: (card, context) =>
                    card.location === 'play area' &&
                    card.getType() === 'character' &&
                    card.controller === context.event.challenge.defendingPlayer
            },
            message:
                '{player} plays {source} to force {target} to be declared as a defender this challenge, if able',
            gameAction: GameActions.simultaneously([
                GameActions.lastingEffect((context) => ({
                    duration: 'untilEndOfChallenge',
                    match: context.target,
                    effect: ability.effects.mustBeDeclaredAsDefender()
                })),
                GameActions.delayedEffect({
                    duration: 'untilEndOfChallenge',
                    when: {
                        afterChallenge: (event, context) =>
                            event.challenge.winner === context.player &&
                            event.challenge.strengthDifference >= 5
                    },
                    message: {
                        format: '{player} uses {source} to have {loser} choose and kill a defending character',
                        args: { loser: (context) => context.event.challenge.loser }
                    },
                    gameAction: GameActions.chooseCards({
                        player: (context) => context.event.challenge.loser,
                        title: 'Select a character to kill',
                        cardCondition: (card, context) =>
                            card.location === 'play area' &&
                            card.getType() === 'character' &&
                            card.controller === context.choosingPlayer &&
                            card.isDefending(),
                        gameAction: (card) => GameActions.kill({ card })
                    })
                })
            ])
        });
    }
}

DornishRevenge.code = '06096';

export default DornishRevenge;
