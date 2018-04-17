const DrawCard = require('../../drawcard.js');

class TywinLannister extends DrawCard {
    setupCardAbilities() {
        this.interrupt({
            when: {
                onCardsDiscarded: event => event.originalLocation === 'draw deck' && event.cards.length === 1
            },
            handler: context => {
                this.eventObj = context.event;
                this.discardingPlayer = this.eventObj.player;

                let top2Cards = this.discardingPlayer.drawDeck.slice(0, 2);
                let buttons = top2Cards.map(card => {
                    return { method: 'cardSelected', card: card, mapCard: true };
                });

                this.game.promptWithMenu(this.controller, this, {
                    activePrompt: {
                        menuTitle: 'Select which card to discard',
                        buttons: buttons
                    },
                    source: this
                });
            }
        });
    }

    cardSelected(player, card) {
        this.eventObj.replaceCards([card]);
        this.game.addMessage('{0} uses {1} to choose {2} to be discarded for {3}', this.controller, this, card, this.discardingPlayer);

        return true;
    }
}

TywinLannister.code = '05006';

module.exports = TywinLannister;
