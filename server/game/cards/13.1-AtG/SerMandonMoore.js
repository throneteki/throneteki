import DrawCard from '../../drawcard.js';
import GameActions from '../../GameActions/index.js';

class SerMandonMoore extends DrawCard {
    // Ser Mandon Moore (13009)
    // Shadow (3).
    // Reaction: After Ser Mandon Moore comes out of shadows, choose an opponent. That player must
    // choose and kill a character he or she controls unless he or she chooses and discards 2 cards
    // from his or her hand.
    setupCardAbilities() {
        this.reaction({
            when: {
                onCardOutOfShadows: (event, context) => event.card === context.source
            },
            chooseOpponent: (player) =>
                player.anyCardsInPlay(
                    (card) => card.getType() === 'character' && card.canBeKilled()
                ),
            message: {
                format: '{player} uses {source} to force {opponent} to discard 2 cards or kill a character',
                args: { opponent: (context) => context.opponent }
            },
            gameAction: GameActions.ifCondition({
                condition: (context) => context.opponent.hand.length >= 2,
                thenAction: GameActions.choose({
                    player: (context) => context.opponent,
                    title: 'Discard 2 cards or kill a character?',
                    choices: {
                        'Discard 2 cards': {
                            message: '{choosingPlayer} discards 2 cards for {source}',
                            gameAction: GameActions.chooseCards({
                                player: (context) => context.opponent,
                                mode: 'exactly',
                                numCards: 2,
                                title: 'Select 2 cards',
                                cardCondition: (card, context) =>
                                    card.controller === context.choosingPlayer &&
                                    card.location === 'hand',
                                gameAction: (card) => GameActions.discardCard({ card })
                            })
                        },
                        'Kill character': killCharacter()
                    }
                }),
                elseAction: killCharacter()
            })
        });
    }
}

function killCharacter() {
    return {
        message: '{opponent} chooses to kill a character for {source}',
        gameAction: GameActions.chooseCards({
            player: (context) => context.opponent,
            title: 'Select character',
            cardCondition: (card, context) =>
                card.getType() === 'character' &&
                card.location === 'play area' &&
                card.controller === context.choosingPlayer,
            gameAction: (card) => GameActions.kill({ card })
        })
    };
}

SerMandonMoore.code = '13009';

export default SerMandonMoore;
