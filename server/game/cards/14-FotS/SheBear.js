import DrawCard from '../../drawcard.js';

class SheBear extends DrawCard {
    setupCardAbilities() {
        this.reaction({
            when: {
                onCardEntersPlay: (event) => event.card === this && event.playingType === 'marshal'
            },
            target: {
                activePromptTitle: 'Select a card',
                cardCondition: (card) =>
                    card.location === 'hand' &&
                    card.controller === this.controller &&
                    ['character', 'attachment'].includes(card.getType()) &&
                    card.isFaction('stark') &&
                    card.hasPrintedCost() &&
                    card.getPrintedCost() <= 3 &&
                    this.controller.canPutIntoPlay(card)
            },
            message: '{player} uses {source} to put {target} into play',
            handler: (context) => {
                context.player.putIntoPlay(context.target);
            }
        });
    }
}

SheBear.code = '14033';

export default SheBear;
