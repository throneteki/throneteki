import DrawCard from '../../drawcard.js';
import GameActions from '../../GameActions/index.js';

class TheReadersSepton extends DrawCard {
    // The Reader's Septon (23003)
    // Action: Kneel The Reader's Septon to choose a player. Switch the top card with the bottom
    // card of that player's deck.
    setupCardAbilities(ability) {
        this.action({
            title: 'Swap top and bottom cards',
            cost: ability.costs.kneelSelf(),
            choosePlayer: () => true,
            message:
                "{player} uses {source} to swap the top and bottom card of {chosenPlayer}'s deck",
            gameAction: GameActions.simultaneously((context) => {
                const deck = context.chosenPlayer.drawDeck;
                if (deck.length < 2) {
                    return [];
                }
                return [
                    GameActions.placeCard({ card: deck[0], location: 'draw deck', bottom: true }),
                    GameActions.placeCard({ card: deck.at(-1), location: 'draw deck' })
                ];
            })
        });
    }
}

TheReadersSepton.code = '23003';

export default TheReadersSepton;
