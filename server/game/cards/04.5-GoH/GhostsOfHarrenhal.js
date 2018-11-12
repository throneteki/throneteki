const _ = require('underscore');

const PlotCard = require('../../plotcard.js');

class GhostsOfHarrenhal extends PlotCard {
    setupCardAbilities() {
        this.whenRevealed({
            handler: () => {
                _.each(this.game.getPlayersInFirstPlayerOrder(), player => {
                    let deadCharacters = player.deadPile.filter(card => card.getType() === 'character');
                    if(!_.isEmpty(deadCharacters)) {
                        let lastDeadCharacter = _.last(deadCharacters);
                        player.putIntoPlay(lastDeadCharacter);

                        this.game.addMessage('{0} uses {1} to put {2} into play from {3}\'s dead pile',
                            this.controller, this, lastDeadCharacter, lastDeadCharacter.controller);
                    }
                });
            }
        });
    }
}

GhostsOfHarrenhal.code = '04100';

module.exports = GhostsOfHarrenhal;
