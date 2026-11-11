import PlotCard from '../../plotcard.js';
import GameActions from '../../GameActions/index.js';

class TheFather extends PlotCard {
    // The Father (20054)
    // Forced Interrupt: When the dominance phase ends, choose a unique non-Army character
    // controlled by each player. Then, return each of those characters to its owner's hand.
    setupCardAbilities() {
        this.forcedInterrupt({
            when: {
                onPhaseEnded: (event, context) =>
                    event.phase === 'dominance' &&
                    context.game.anyCardsInPlay(isUniqueNonArmyCharacter)
            },
            target: {
                choosingPlayer: 'each',
                ifAble: true,
                cardCondition: (card, context) =>
                    card.location === 'play area' &&
                    isUniqueNonArmyCharacter(card) &&
                    card.controller === context.choosingPlayer,
                gameAction: GameActions.returnCardToHand((context) => ({ card: context.target }))
            }
        });
    }
}

function isUniqueNonArmyCharacter(card) {
    return card.getType() === 'character' && card.isUnique() && !card.hasTrait('Army');
}

TheFather.code = '20054';

export default TheFather;
