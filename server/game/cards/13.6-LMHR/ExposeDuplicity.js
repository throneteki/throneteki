const PlotCard = require('../../plotcard.js');
const GameActions = require('../../GameActions');

class ExposeDuplicity extends PlotCard {
    setupCardAbilities() {
        this.whenRevealed({
            message: '{player} uses {source} to discard each card in shadows',
            handler: () => {
                let cardsInShadows = this.game.allCards.filter(
                    (card) => card.location === 'shadows'
                );

                let actions = cardsInShadows.map((cardInShadow) => {
                    return GameActions.discardCard({ card: cardInShadow });
                });

                this.game.resolveGameAction(GameActions.simultaneously(actions));
            }
        });
    }
}

ExposeDuplicity.code = '13120';

module.exports = ExposeDuplicity;
