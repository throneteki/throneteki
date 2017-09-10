const _ = require('underscore');

const DrawCard = require('../../drawcard.js');

class Oldtown extends DrawCard {
    setupCardAbilities(ability) {
        this.action({
            title: 'Reveal top card of deck',
            cost: ability.costs.kneelSelf(),
            handler: () => {
                let cardTypes = ['Character', 'Location', 'Attachment', 'Event'];

                let buttons = _.map(cardTypes, cardType => {
                    return { text: cardType, method: 'cardTypeSelected', arg: cardType.toLowerCase() };
                });

                this.game.promptWithMenu(this.controller, this, {
                    activePrompt: {
                        menuTitle: 'Select a card type',
                        buttons: buttons
                    },
                    source: this.card
                });
            }
        });
    }

    cardTypeSelected(player, cardType) {
        this.game.addMessage('{0} kneels {1} to name the {2} card type', this.controller, this, cardType);

        let topCard = this.controller.drawDeck.first();
        let message = '{0} then reveals {1} as the top card of their deck';

        if(topCard.getType() === cardType) {
            this.controller.drawCardsToHand(1);
            this.game.addPower(this.controller, 1);
            message += ', draws it and gains 1 power for their faction';
        }

        this.game.addMessage(message, this.controller, topCard);

        return true;
    }
}

Oldtown.code = '08024';

module.exports = Oldtown;
