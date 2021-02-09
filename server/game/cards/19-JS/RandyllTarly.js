const DrawCard = require('../../drawcard.js');

class RandyllTarly extends DrawCard {
    setupCardAbilities(ability) {
        this.action({
            title: 'Stand Army or reveal top card',
            limit: ability.limit.perPhase(2),
            cost: ability.costs.kneel(card => card.getType() === 'location' && card.hasTrait('The Reach')),
            handler: context => {
                this.context = context;

                this.game.promptWithMenu(context.player, this, {
                    activePrompt: {
                        menuTitle: 'Choose one',
                        buttons: [
                            { text: 'Stand an Army', method: 'standArmy' },
                            { text: 'Reveal top card', method: 'revealtopcard' }
                        ]
                    },
                    source: this
                });
            }
        });
    }

    standArmy() {
        this.game.promptForSelect(this.context.player, {
            activePromptTitle: 'Select an Army',
            source: this,
            cardCondition: card => card.location === 'play area' && card.getType() === 'character' && card.hasTrait('Army') && card.kneeled,
            gameAction: 'stand',
            onSelect: (player, card) => this.onArmySelected(player, card),
            onCancel: (player) => this.cancelSelection(player)
        });

        return true;
    }

    revealtopcard() {
        let topCard = this.context.player.drawDeck[0];
        let msg = '{0} uses {1} to reveal {2} as the top card of their deck';

        if(topCard.getType() === 'location' && topCard.hasTrait('The Reach')) {
            this.context.player.putIntoPlay(topCard);
            msg += 'and puts it into play';
        } if(topCard.getType() === 'location' && !topCard.hasTrait('The Reach')) {
            if(this.context.player.canDraw()) {
                this.context.player.drawCardsToHand(1);
                msg += ' and draws it';
            }
        }
        this.game.addMessage(msg, this.context.player, this, topCard);
        return true;
    }

    onArmySelected(player, card) {
        card.controller.standCard(card);
        this.game.addMessage('{0} uses {1} to kneel {2} and stand {3}', player, this, this.context.costs.kneel, card);

        return true;
    }

    cancelSelection(player) {
        this.game.addAlert('danger', '{0} cancels the resolution of {1}', player, this);
        return true;
    }
}

RandyllTarly.code = '19015';

module.exports = RandyllTarly;
