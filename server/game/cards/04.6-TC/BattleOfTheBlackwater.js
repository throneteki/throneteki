const PlotCard = require('../../plotcard.js');

class BattleOfTheBlackwater extends PlotCard {
    setupCardAbilities() {
        this.whenRevealed({
            chooseOpponent: true,
            handler: context => {
                this.removeAllDupes(this.controller);
                this.removeAllDupes(context.opponent);

                this.game.addMessage('{0} uses {1} to have themself and {2} discard each duplicate they control',
                    this.controller, this, context.opponent);
            }
        });
    }

    removeAllDupes(player) {
        // TODO: This implementation only works for 2 player games. The wording
        // of the card is that you discard each duplicate you and your opponent
        // control, not discarding the dupes on cards you or the opponent
        // control. But for 2 player, discarding each dupe is fine.
        let characters = player.filterCardsInPlay(card => card.dupes.size() > 0);
        let dupes = characters.reduce((dupes, card) => dupes.concat(card.dupes.toArray()), []);
        player.discardCards(dupes, false);
    }
}

BattleOfTheBlackwater.code = '04120';

module.exports = BattleOfTheBlackwater;
