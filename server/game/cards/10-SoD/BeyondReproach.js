const PlotCard = require('../../plotcard.js');

class BeyondReproach extends PlotCard {
    setupCardAbilities() {
        this.whenRevealed({
            handler: () => {
                let attachments = this.game.filterCardsInPlay(card => card.getType() === 'attachment' &&
                                                                      card.parent &&
                                                                      card.parent.getType() === 'character' &&
                                                                      card.controller !== card.parent.controller);
                
                for(let card of attachments) {
                    card.owner.sacrificeCard(card);
                }

                this.game.addMessage('{0} uses {1} to have each player sacrifice each attachment that is attached to a character they do not control',
                    this.controller, this);
            }
        });
    }
}

BeyondReproach.code = '10049';

module.exports = BeyondReproach;
