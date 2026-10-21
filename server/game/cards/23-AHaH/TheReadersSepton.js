import DrawCard from '../../drawcard.js';

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
                "{player} uses {source} to swap the top and bottom card of {chosenPlayer}'s deck.",
            handler: (context) => {
                let chosenPlayer = context.chosenPlayer;
                let topCard = chosenPlayer.drawDeck[0];
                let bottomCard = chosenPlayer.drawDeck.slice(-1)[0];
                chosenPlayer.moveCard(topCard, 'draw deck', { bottom: true });
                chosenPlayer.moveCard(bottomCard, 'draw deck');
            }
        });
    }
}

TheReadersSepton.code = '23003';

export default TheReadersSepton;
