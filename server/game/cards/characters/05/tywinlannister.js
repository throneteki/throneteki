const _ = require('underscore');

const DrawCard = require('../../../drawcard.js');

class TywinLannister extends DrawCard {
    setupCardAbilities() {
        this.interrupt({
            when: {
                onCardsDiscarded: (event, params) => params.originalLocation === 'draw deck' && params.cards.length === 1
            },
            handler: context => {
                this.paramsObj = context.event.params[1];
                this.discardingPlayer = this.paramsObj.player;

                var top2Cards = this.discardingPlayer.drawDeck.first(2);
                var buttons = _.map(top2Cards, card => {
                    return { text: card.name, method: 'cardSelected', arg: card.uuid, card: card.getSummary(true) };
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

    cardSelected(player, cardId) {
        var card = this.discardingPlayer.findCardByUuid(this.discardingPlayer.drawDeck, cardId);

        if(!card) {
            return false;
        }

        this.paramsObj.cards = [card];
        this.game.addMessage('{0} uses {1} to choose {2} to be discarded for {3}', this.controller, this, card, this.discardingPlayer);

        return true;
    }
}

TywinLannister.code = '05006';

module.exports = TywinLannister;
