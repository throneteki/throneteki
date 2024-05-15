import DrawCard from '../../drawcard.js';
import GameActions from '../../GameActions/index.js';

class AlerieTyrell extends DrawCard {
    setupCardAbilities() {
        this.reaction({
            when: {
                onCardEntersPlay: (event) => event.card === this
            },
            message:
                '{player} uses {source} to search the top 10 cards of their deck for a Tyrell character with printed cost 3 or lower',
            gameAction: GameActions.search({
                title: 'Select a character',
                topCards: 10,
                match: { type: 'character', printedCostOrLower: 3, faction: 'tyrell' },
                message: '{player} {gameAction}',
                gameAction: GameActions.addToHand((context) => ({
                    card: context.searchTarget
                }))
            })
        });
    }
}

AlerieTyrell.code = '05037';

export default AlerieTyrell;
