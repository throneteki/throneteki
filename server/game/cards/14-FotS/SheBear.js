import DrawCard from '../../drawcard.js';
import GameActions from '../../GameActions/index.js';

class SheBear extends DrawCard {
    setupCardAbilities() {
        this.reaction({
            when: {
                onCardEntersPlay: (event) => event.card === this && event.playingType === 'marshal'
            },
            target: {
                activePromptTitle: 'Select a card',
                cardCondition: (card, context) =>
                    card.location === 'hand' &&
                    card.controller === context.player &&
                    ['character', 'attachment'].includes(card.getType()) &&
                    card.isFaction('stark') &&
                    card.hasPrintedCost() &&
                    card.getPrintedCost() <= 3,
                gameAction: 'putIntoPlay'
            },
            message: '{player} uses {source} to put {target} into play',
            gameAction: GameActions.putIntoPlay((context) => ({ card: context.target }))
        });
    }
}

SheBear.code = '14033';

export default SheBear;
