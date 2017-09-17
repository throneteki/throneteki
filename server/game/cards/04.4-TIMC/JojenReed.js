const DrawCard = require('../../drawcard.js');

class JojenReed extends DrawCard {
    setupCardAbilities() {
        this.reaction({
            when: {
                onCardStood: event => event.card === this
            },
            handler: () => {
                for(let player of this.game.getPlayers()) {
                    let card = player.drawDeck.first();
                    this.game.addMessage('{0} uses {1} to reveal {2} from {3}\'s deck', this.controller, this, card, player);
                }

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
        for(let player of this.game.getPlayers()) {
            player.drawCardsToHand(1);
        }

        this.game.addMessage('{0} uses {1} to have revealed cards drawn', this.controller, this);

        return true;
    }

    discard() {
        for(let player of this.game.getPlayers()) {
            player.discardFromDraw(1);
        }

        this.game.addMessage('{0} uses {1} to have revealed cards discarded', this.controller, this);

        return true;
    }
}

JojenReed.code = '04061';

module.exports = JojenReed;
