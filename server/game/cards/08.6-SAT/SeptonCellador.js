import DrawCard from '../../drawcard.js';
import GameActions from '../../GameActions/index.js';

class SeptonCellador extends DrawCard {
    // Septon Cellador (08105)
    // Challenges Action: Kneel Septon Cellador to choose an opponent. That player must choose and
    // discard a character from his or her hand unless he or she reveals a hand containing no
    // characters.
    setupCardAbilities(ability) {
        this.action({
            title: 'Opponent discards character',
            phase: 'challenge',
            cost: ability.costs.kneelSelf(),
            chooseOpponent: (opponent) => opponent.hand.length !== 0,
            gameAction: GameActions.ifCondition({
                condition: (context) =>
                    context.opponent.hand.some((card) => card.getType() === 'character'),
                thenAction: {
                    message:
                        '{player} kneels {source} to have {opponent} discard a character from their hand',
                    gameAction: GameActions.chooseCards({
                        player: (context) => context.opponent,
                        title: 'Select a character to discard',
                        cardCondition: (card, context) =>
                            card.location === 'hand' &&
                            card.controller === context.opponent &&
                            card.getType() === 'character',
                        gameAction: (card) => GameActions.discardCard({ card })
                    })
                },
                elseAction: {
                    message: '{player} kneels {source} to have {opponent} reveal their hand',
                    gameAction: GameActions.revealCards((context) => ({
                        cards: context.opponent.hand,
                        player: context.opponent
                    }))
                }
            })
        });
    }
}

SeptonCellador.code = '08105';

export default SeptonCellador;
