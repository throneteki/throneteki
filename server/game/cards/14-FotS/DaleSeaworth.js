import DrawCard from '../../drawcard.js';
import GameActions from '../../GameActions/index.js';

class DaleSeaworth extends DrawCard {
    // Dale Seaworth (14010)
    // Reaction: After you marshal Dale Seaworth, choose a [baratheon] location in your discard pile
    // and return it to your hand.
    setupCardAbilities() {
        this.reaction({
            when: {
                onCardEntersPlay: (event, context) =>
                    event.card === context.source && event.playingType === 'marshal'
            },
            target: {
                activePromptTitle: 'Select a location',
                cardCondition: (card, context) =>
                    card.location === 'discard pile' &&
                    card.getType() === 'location' &&
                    card.isFaction('baratheon') &&
                    card.controller === context.source.controller
            },
            message: '{player} uses {source} to return {target} to hand',
            gameAction: GameActions.returnCardToHand((context) => ({ card: context.target }))
        });
    }
}

DaleSeaworth.code = '14010';

export default DaleSeaworth;
