import PlotCard from '../../plotcard.js';
import GameActions from '../../GameActions/index.js';

const isEligible = (card) =>
    card.location === 'play area' &&
    card.getType() === 'character' &&
    !card.hasTrait('Army') &&
    card.getPrintedCost() >= 6;

class Duel extends PlotCard {
    // Duel (06060)
    // When Revealed: Choose an opponent. That player chooses 2 non-Army characters, each with
    // printed cost 6 or higher. Then, that player chooses and kneels 1 of those characters. Kill
    // the other (cannot be saved).
    setupCardAbilities() {
        this.whenRevealed({
            chooseOpponent: true,
            message:
                '{player} uses {source} to have {opponent} choose 2 non-Army characters with printed cost 6 or higher, kneel 1 and kill the other',
            gameAction: GameActions.ifCondition({
                condition: (context) =>
                    context.game.filterCardsInPlay((card) => isEligible(card)).length >= 2,
                thenAction: GameActions.chooseCards({
                    player: (context) => context.opponent,
                    title: 'Choose a character to kneel',
                    cardCondition: (card) => isEligible(card),
                    gameAction: (card) => GameActions.kneelCard({ card })
                }).then({
                    gameAction: GameActions.chooseCards({
                        player: (context) => context.parentContext.opponent,
                        title: 'Choose a character to kill',
                        cardCondition: (card, context) =>
                            isEligible(card) && !context.parentContext.chosenCards.includes(card),
                        gameAction: (card) => GameActions.kill({ card, allowSave: false })
                    })
                })
            })
        });
    }
}

Duel.code = '06060';

export default Duel;
