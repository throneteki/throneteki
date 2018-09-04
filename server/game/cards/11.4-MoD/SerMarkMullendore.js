const DrawCard = require('../../drawcard');

class SerMarkMullendore extends DrawCard {
    setupCardAbilities() {
        this.reaction({
            when: {
                afterChallenge: event => event.challenge.winner === this.controller && event.challenge.isParticipating(this) && this.controller.drawDeck.length >= 1
            },
            handler: context => {
                this.topCard = this.controller.drawDeck[0];

                this.game.addMessage('{0} uses {1} to reveal the top card of their deck as {2}', this.controller, this, this.topCard);

                if(this.topCard.getType() === 'character') {
                    if(!this.controller.canPutIntoPlay(this.topCard)) {
                        this.game.addMessage('{0} is unable to put {1} into play for {2}', this.controller, this.topCard, this);
                        return;
                    }

                    this.game.promptWithMenu(context.player, this, {
                        activePrompt: {
                            menuTitle: `Put ${this.topCard.name} into play?`,
                            buttons: [
                                { text: 'Yes', method: 'accept' },
                                { text: 'No', method: 'decline' }
                            ]
                        }
                    });
                }
            }
        });
    }

    accept() {
        this.game.addMessage('{0} chooses to put {1} into play and return {2} to the top of their deck', this.controller, this.topCard, this);
        this.controller.putIntoPlay(this.topCard);
        this.controller.moveCardToTopOfDeck(this, false);
        return true;
    }

    decline() {
        this.game.addMessage('{0} chooses not to put {1} into play for {2}', this.controller, this.topCard, this);
        return true;
    }
}

SerMarkMullendore.code = '11063';

module.exports = SerMarkMullendore;
