const DrawCard = require('../../../drawcard.js');

class LadyInWaiting extends DrawCard {
    setupCardAbilities() {
        this.action({
            title: 'Marshal Lady-In-Waiting as a duplicate on a lady at no cost',
            method: 'marshalAsDupe',
            canPlayFrom: 'hand'
        });
    }
    marshalAsDupe() {
        this.game.promptForSelect(this.controller, {
            activePromptTitle: 'Select a character',
            waitingPromptTitle: 'Waiting for opponent to use ' + this.name,
            cardCondition: card => card.location === 'play area' && card.getType() === 'character' && card.hasTrait('Lady'),
            onSelect: (p, card) => this.onCardSelected(p, card)
        });
        return true;
    }
    onCardSelected(player, card) {
        this.controller.removeCardFromPile(this);
        card.addDuplicate(this);
        this.game.addMessage('{0} places {1} on {2} as a duplicate', this.controller, this, card);
        return true;
    }
}

LadyInWaiting.code = '02023';

module.exports = LadyInWaiting;
