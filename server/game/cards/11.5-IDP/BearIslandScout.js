import DrawCard from '../../drawcard.js';
import Conditions from '../../Conditions.js';
import GameActions from '../../GameActions/index.js';

class BearIslandScout extends DrawCard {
    setupCardAbilities() {
        this.reaction({
            when: {
                onCardEntersPlay: (event) =>
                    event.card === this &&
                    event.playingType === 'marshal' &&
                    Conditions.allCharactersAreStark({ player: this.controller })
            },
            message: '{player} uses {source} to search their deck for a House Mormont card',
            gameAction: GameActions.search({
                title: 'Select a card',
                match: { trait: 'House Mormont' },
                message: '{player} {gameAction}',
                gameAction: GameActions.addToHand((context) => ({
                    card: context.searchTarget
                }))
            })
        });
    }
}

BearIslandScout.code = '11081';

export default BearIslandScout;
