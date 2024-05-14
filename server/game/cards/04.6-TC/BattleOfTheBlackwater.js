import PlotCard from '../../plotcard.js';

class BattleOfTheBlackwater extends PlotCard {
    setupCardAbilities() {
        this.whenRevealed({
            chooseOpponent: true,
            handler: (context) => {
                this.removeAllDupes(context.player);
                this.removeAllDupes(context.opponent);

                this.game.addMessage(
                    '{0} uses {1} to have themself and {2} discard each duplicate they control',
                    context.player,
                    this,
                    context.opponent
                );
            }
        });
    }

    removeAllDupes(player) {
        let dupes = this.game.allCards.filter(
            (card) => card.controller === player && card.location === 'duplicate'
        );
        player.discardCards(dupes, false);
    }
}

BattleOfTheBlackwater.code = '04120';

export default BattleOfTheBlackwater;
