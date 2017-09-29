const PlotCard = require('../../plotcard.js');

class WeaponsAtTheDoor extends PlotCard {
    setupCardAbilities() {
        this.forcedReaction({
            when: {
                onPhaseStarted: event => event.phase === 'challenge'
            },
            handler: () => {
                let attachments = this.game.allCards.filter(card => card.getPrintedType() === 'attachment' && card.parent);
                for(let card of attachments) {
                    card.owner.returnCardToHand(card);
                }

                this.game.addMessage('{0} uses {1} to force both players to return each card with printed attachment card type to their hand', this.controller, this);
            }
        });
    }
}

WeaponsAtTheDoor.code = '03051';

module.exports = WeaponsAtTheDoor;
