import DrawCard from '../../drawcard.js';
import GameActions from '../../GameActions/index.js';

class DaggersInTheDark extends DrawCard {
    // Daggers in the Dark (11106)
    // Shadow (2).
    // Reaction: After you win a challenge as the defending player, choose and kill an attacking
    // character. The attacking player may sacrifice 2 characters to cancel this effect.
    setupCardAbilities() {
        this.reaction({
            when: {
                afterChallenge: (event, context) =>
                    event.challenge.winner === context.player &&
                    event.challenge.defendingPlayer === context.player
            },
            target: {
                cardCondition: (card, context) =>
                    card.location === 'play area' &&
                    card.getType() === 'character' &&
                    card.controller === context.event.challenge.loser &&
                    card.isAttacking(),
                gameAction: 'kill'
            },
            gameAction: GameActions.ifCondition({
                condition: (context) =>
                    !context.ability.cannotBeCanceled &&
                    context.event.challenge.loser.getNumberOfCardsInPlay(
                        (card) => card.getType() === 'character'
                    ) >= 2,
                thenAction: GameActions.choose({
                    player: (context) => context.event.challenge.loser,
                    title: 'Sacrifice 2 characters to cancel "Daggers in the Dark"?',
                    choices: {
                        Yes: {
                            message:
                                '{player} plays {source} to kill {target}, but the effect is cancelled by {choosingPlayer} sacrificing 2 characters',
                            gameAction: GameActions.chooseCards({
                                player: (context) => context.event.challenge.loser,
                                mode: 'exactly',
                                numCards: 2,
                                title: 'Select 2 characters',
                                cardCondition: (card, context) =>
                                    card.location === 'play area' &&
                                    card.controller === context.choosingPlayer &&
                                    card.getType() === 'character',
                                gameAction: (card) => GameActions.sacrificeCard({ card })
                            })
                        },
                        No: kill()
                    }
                }),
                elseAction: kill()
            })
        });
    }
}

function kill() {
    return {
        message: '{player} plays {source} to kill {target}',
        gameAction: GameActions.kill((context) => ({ card: context.target }))
    };
}

DaggersInTheDark.code = '11106';

export default DaggersInTheDark;
