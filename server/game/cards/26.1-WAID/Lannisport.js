import DrawCard from '../../drawcard.js';
import GameActions from '../../GameActions/index.js';

class Lannisport extends DrawCard {
    // Lannisport (26006)
    // Reaction: After a [power] challenge is initiated against you, kneel Lannisport to end the
    // challenge with no winner or loser unless the attacking player chooses and discards 1 card
    // from their hand.
    // +1 Income.
    setupCardAbilities(ability) {
        this.plotModifiers({
            gold: 1
        });
        this.reaction({
            when: {
                onChallengeInitiated: (event, context) =>
                    event.challenge.initiatedAgainstPlayer === context.player &&
                    event.challenge.initiatedChallengeType === 'power'
            },
            cost: ability.costs.kneelSelf(),
            message: {
                format: '{player} kneels {source} to end the challenge with no winner or loser unless {attackingPlayer} discards 1 card from their hand',
                args: { attackingPlayer: (context) => context.event.challenge.attackingPlayer }
            },
            gameAction: GameActions.ifCondition({
                condition: (context) => context.event.challenge.initiatingPlayer.hand.length > 0,
                thenAction: GameActions.choose({
                    player: (context) => context.event.challenge.initiatingPlayer,
                    title: (context) => `Discard a card for ${context.source.name}?`,
                    choices: {
                        Yes: {
                            message: '{choosingPlayer} discards a card from their hand',
                            gameAction: GameActions.chooseCards({
                                player: (context) => context.event.challenge.initiatingPlayer,
                                title: 'Select a card',
                                cardCondition: (card, context) =>
                                    card.controller === context.choosingPlayer &&
                                    card.location === 'hand',
                                gameAction: (card) => GameActions.discardCard({ card })
                            })
                        },
                        No: endChallenge()
                    }
                }),
                elseAction: endChallenge()
            })
        });
    }
}

function endChallenge() {
    return {
        message: {
            format: '{attackingPlayer} does not discard a card from their hand, cancelling the challenge',
            args: { attackingPlayer: (context) => context.event.challenge.initiatingPlayer }
        },
        gameAction: GameActions.endChallenge((context) => ({ challenge: context.event.challenge }))
    };
}

Lannisport.code = '26006';

export default Lannisport;
