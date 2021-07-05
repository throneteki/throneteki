const DrawCard = require('../../drawcard');

class TheHigherMysteries extends DrawCard {
    setupCardAbilities() {
        this.reaction({
            when: {
                afterChallenge: event => event.challenge.winner === this.controller && this.hasParticipatingMaester() && this.controller.drawDeck.length >= 1
            },
            handler: context => {
                this.topCard = context.player.drawDeck[0];
                
                if(!context.player.canPutIntoPlay(this.topCard)) {
                    this.game.addMessage('{0} is unable to put {1} into play for {2}', context.player, this.topCard, this);
                    return;
                }
               
                context.player.putIntoPlay(this.topCard);
                this.game.addMessage('{0} plays {1} to put {2} into play from their deck', context.player, this, this.topCard);
            }
        });
    }
        
    hasParticipatingMaester() {
        return this.controller.anyCardsInPlay(card => card.hasTrait('Maester') &&
                                                      card.isParticipating() &&
                                                      card.getType() === 'character');
    }
}

TheHigherMysteries.code = '20048';

module.exports = TheHigherMysteries;
