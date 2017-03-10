const _ = require('underscore');

const DrawCard = require('../../../drawcard.js');

class JojenReed extends DrawCard {
    setupCardAbilities() {
        this.reaction({
            when: {
                onCardStood: (e, player, card) => card === this
            },
            handler: () => {
                var otherPlayer = this.game.getOtherPlayer(this.controller);

                if(!otherPlayer) {
                    return;
                }

                var ownCard = this.controller.drawDeck.value()[0];
                var opponentCard = otherPlayer.drawDeck.value()[0];

                this.game.addMessage('{0} uses {1} to reveal {2} from his own deck and {3} from {4}\'s deck', 
                                      this.controller, this, ownCard, opponentCard, otherPlayer);
                
                this.game.promptWithMenu(this.controller, this, {
                    activePrompt: {
                        menuTitle: 'Draw or discard revealed cards?',
                        buttons: [
                            { text: 'Draw', method: 'draw' },
                            { text: 'Discard', method: 'discard' }
                        ]
                    },
                    source: this
                }); 
            }
        });
    }

    draw() {
        _.each(this.game.getPlayers(), player => {
            player.drawCardsToHand(1);
        });

        this.game.addMessage('{0} uses {1} to have revealed cards drawn', this.controller, this);

        return true;
    }

    discard() {
        _.each(this.game.getPlayers(), player => {
            player.discardFromDraw(1);
        });

        this.game.addMessage('{0} uses {1} to have revealed cards discarded', this.controller, this);

        return true;
    }
}

JojenReed.code = '04061';

module.exports = JojenReed;
