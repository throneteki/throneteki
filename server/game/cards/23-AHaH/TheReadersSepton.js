import DrawCard from '../../drawcard.js';

class TheReadersSepton extends DrawCard {
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
