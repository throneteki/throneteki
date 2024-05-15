import DrawCard from '../../drawcard.js';
import GameActions from '../../GameActions/index.js';

class DaleSeaworth extends DrawCard {
    setupCardAbilities() {
        this.reaction({
            when: {
                onCardEntersPlay: (event) => event.card === this && event.playingType === 'marshal'
            },
            target: {
                activePromptTitle: 'Select a location',
                cardCondition: (card) =>
                    card.location === 'discard pile' &&
                    card.getType() === 'location' &&
                    card.isFaction('baratheon') &&
                    card.controller === this.controller
            },
            message: '{player} uses {source} to return {target} to hand',
            handler: (context) => {
                this.game.resolveGameAction(
                    GameActions.returnCardToHand((context) => ({ card: context.target })),
                    context
                );
            }
        });
    }
}

DaleSeaworth.code = '14010';

export default DaleSeaworth;
