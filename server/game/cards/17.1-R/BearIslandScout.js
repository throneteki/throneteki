import DrawCard from '../../drawcard.js';
import Conditions from '../../Conditions.js';
import GameActions from '../../GameActions/index.js';

class BearIslandScout extends DrawCard {
    // Bear Island Scout (17124)
    // Reaction: After you marshal Bear Island Scout, if each character you control has the [stark]
    // affiliation, search the top 10 cards of your deck for a House Mormont card, reveal it, and
    // add it to your hand. Shuffle your deck.
    setupCardAbilities() {
        this.reaction({
            when: {
                onCardEntersPlay: (event, context) =>
                    event.card === context.source &&
                    event.playingType === 'marshal' &&
                    Conditions.allCharactersAreStark({ player: context.player })
            },
            message:
                '{player} uses {source} to search the top 10 cards of their deck for a House Mormont card',
            gameAction: GameActions.search({
                title: 'Select a card',
                topCards: 10,
                match: { trait: 'House Mormont' },
                message: '{player} {gameAction}',
                gameAction: GameActions.addToHand((context) => ({
                    card: context.searchTarget
                }))
            })
        });
    }
}

BearIslandScout.code = '17124';

export default BearIslandScout;
