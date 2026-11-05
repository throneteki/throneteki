import DrawCard from '../../drawcard.js';
import GameActions from '../../GameActions/index.js';

class MutinyAtCrastersKeep extends DrawCard {
    // Mutiny At Craster's Keep (06086)
    // Dominance Action: Choose a character with the highest printed cost among characters you
    // control. Sacrifice that character to choose a character an opponent controls and discard it
    // from play.
    setupCardAbilities(ability) {
        this.action({
            title: 'Discard character from play',
            phase: 'dominance',
            cost: ability.costs.sacrifice(
                (card, context) =>
                    card.getType() === 'character' &&
                    card.getPrintedCost() === context.source.getHighestCharacterCost()
            ),
            target: {
                cardCondition: (card, context) =>
                    card.location === 'play area' &&
                    card.controller !== context.source.controller &&
                    card.getType() === 'character'
            },
            message:
                '{player} plays {source} and sacrifices {costs.sacrifice} to discard {target} from play',
            gameAction: GameActions.discardCard((context) => ({ card: context.target }))
        });
    }

    getHighestCharacterCost() {
        let charactersInPlay = this.controller.filterCardsInPlay(
            (card) => card.getType() === 'character' && card.hasPrintedCost()
        );
        let costs = charactersInPlay.map((card) => card.getPrintedCost());
        return Math.max(...costs);
    }
}

MutinyAtCrastersKeep.code = '06086';

export default MutinyAtCrastersKeep;
