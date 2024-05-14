const PlotCard = require('../../plotcard.js');

class GhostsOfHarrenhal extends PlotCard {
    setupCardAbilities() {
        this.whenRevealed({
            handler: (context) => {
                for (let player of this.game.getPlayersInFirstPlayerOrder()) {
                    let deadCharacters = player.deadPile.filter(
                        (card) => card.getType() === 'character'
                    );
                    if (deadCharacters.length !== 0) {
                        let lastDeadCharacter = deadCharacters[deadCharacters.length - 1];
                        player.putIntoPlay(lastDeadCharacter);

                        this.game.addMessage(
                            "{0} uses {1} to put {2} into play from {3}'s dead pile",
                            context.player,
                            this,
                            lastDeadCharacter,
                            lastDeadCharacter.controller
                        );
                    }
                }
            }
        });
    }
}

GhostsOfHarrenhal.code = '04100';

module.exports = GhostsOfHarrenhal;
