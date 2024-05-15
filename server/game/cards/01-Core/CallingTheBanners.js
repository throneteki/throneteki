import PlotCard from '../../plotcard.js';

class CallingTheBanners extends PlotCard {
    setupCardAbilities() {
        this.whenRevealed({
            chooseOpponent: true,
            handler: (context) => {
                let characterCount = context.opponent.getNumberOfCardsInPlay(
                    (card) => card.getType() === 'character'
                );
                if (characterCount <= 0) {
                    return;
                }

                let gold = this.game.addGold(context.player, characterCount);
                this.game.addMessage('{0} uses {1} to gain {2} gold', context.player, this, gold);
            }
        });
    }
}

CallingTheBanners.code = '01007';

export default CallingTheBanners;
