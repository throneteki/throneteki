import DrawCard from '../../drawcard.js';

class CaswellsKeep extends DrawCard {
    // Caswell's Keep (04064)
    // Reaction: After you reveal a plot card, choose a player. Look at the top 2 cards of that
    // player's deck. Place 1 of those cards on the bottom of that deck, and the other on top.
    setupCardAbilities() {
        this.reaction({
            when: {
                onPlotsRevealed: (event) =>
                    event.plots.some((plot) => plot.controller === this.controller)
            },
            choosePlayer: true,
            message: "{player} uses {source} to look at the top 2 cards of {chosenPlayer}'s deck",
            handler: (context) => {
                this.selectedPlayer = context.chosenPlayer;

                this.topCards = this.selectedPlayer.searchDrawDeck(2);

                let buttons = this.topCards.map((card) => ({
                    method: 'selectCard',
                    card: card
                }));

                this.game.promptWithMenu(this.controller, this, {
                    activePrompt: {
                        menuTitle: 'Choose card to place on bottom of deck',
                        buttons: buttons
                    },
                    source: this
                });
            }
        });
    }

    selectCard(player, cardId) {
        let card = this.topCards.find((c) => c.uuid === cardId);
        let otherCard = this.topCards.find((c) => c.uuid !== cardId);

        if (!card) {
            return false;
        }

        this.selectedPlayer.moveCard(card, 'draw deck', { bottom: true });
        this.selectedPlayer.moveCard(otherCard, 'draw deck', { bottom: false });
        this.game.addMessage(
            "{0} placed 1 card on the bottom of {1}'s deck and the rest on top",
            this.controller,
            this.selectedPlayer
        );

        return true;
    }
}

CaswellsKeep.code = '04064';

export default CaswellsKeep;
