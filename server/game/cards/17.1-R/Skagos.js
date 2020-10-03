
const DrawCard = require('../../drawcard.js');

class Skagos extends DrawCard {
    setupCardAbilities(ability) {
        this.action({
            title: 'Replace standing Stark card',
            cost: [
                ability.costs.kneelSelf(),
                ability.costs.putSelfIntoShadows(),
                ability.costs.sacrifice(card => card.isFaction('stark') && !card.kneeled && card.location !== 'duplicate')
            ],
            handler: context => {
                this.currentContext = context;
                this.game.promptForDeckSearch(context.player, {
                    activePromptTitle: 'Select a card',
                    cardCondition: card => card.name === context.costs.sacrifice.name && context.player.canPutIntoPlay(card),
                    onSelect: (player, card) => this.cardSelected(player, card),
                    onCancel: player => this.doneSelecting(player),
                    source: this
                });
            }
        });
    }

    cardSelected(player, card) {
        this.game.addMessage('{0} kneels and returns {1} to shadows and sacrifices {2} to search their deck and put {3} into play knelt', player, this, this.currentContext.costs.sacrifice, card);
        player.putIntoPlay(card, 'play', { kneeled: true });
    }

    doneSelecting(player) {
        this.game.addMessage('{0} kneels and returns {1} to shadows and sacrifices {2} to search their deck, but does not put a card into play', player, this, this.currentContext.costs.sacrifice);
    }
}

Skagos.code = '17125';

module.exports = Skagos;
