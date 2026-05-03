import PlotCard from '../../plotcard.js';

class AllMenMustServe extends PlotCard {
    setupCardAbilities() {
        this.whenRevealed({
            handler: () => {
                let kneelCharacters = this.game.filterCardsInPlay(
                    (card) => card.getType() === 'character'
                );

                if (kneelCharacters.length > 0) {
                    for (let card of kneelCharacters) {
                        card.controller.kneelCard(card);
                    }
                    this.game.addMessage('{0} uses {1} to kneel each character', this.controller);
                }
            }
        });
    }
}

AllMenMustServe.code = '00325';

export default AllMenMustServe;
