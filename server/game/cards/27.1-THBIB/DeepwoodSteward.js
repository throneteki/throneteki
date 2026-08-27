import DrawCard from '../../drawcard.js';
import GameActions from '../../GameActions/index.js';

class DeepwoodSteward extends DrawCard {
    setupCardAbilities() {
        this.reaction({
            when: {
                onCardEntersPlay: (event) => event.card === this && event.playingType === 'marshal'
            },
            message:
                '{player} uses {source} to search the top 10 cards of their deck for a The North or out-of-faction location',
            gameAction: GameActions.search({
                title: 'Select a location',
                topCards: 10,
                match: {
                    type: 'location',
                    condition: (card) => card.hasTrait('The North') || card.isOutOfFaction()
                },
                message: '{player} {gameAction}',
                gameAction: GameActions.addToHand((context) => ({
                    card: context.searchTarget
                }))
            })
        });
    }
}

DeepwoodSteward.code = '27001';

export default DeepwoodSteward;
