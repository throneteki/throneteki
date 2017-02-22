const DrawCard = require('../../../drawcard.js');

class GreyWind extends DrawCard {
    setupCardAbilities(ability) {
        this.action({
            title: 'Kneel Grey Wind to kill a character',
            method: 'kill',
            cost: ability.costs.kneelSelf(),
            phase: 'challenge'
        });
    }

    kill(player) {
        this.game.promptForSelect(player, {
            cardCondition: card => this.cardCondition(card),
            activePromptTitle: 'Select a character',
            waitingPromptTitle: 'Waiting for opponent to use ' + this.name,
            onSelect: (player, card) => this.onCardSelected(player, card)
        });

        return true;
    }

    cardCondition(card) {
        var str = this.controller.findCardByName(this.controller.cardsInPlay, 'Robb Stark') ? 2 : 1;

        return card.getStrength() <= str && card.location === 'play area' && card.getType() === 'character';
    }

    onCardSelected(player, card) {
        card.controller.killCharacter(card);

        this.game.addMessage('{0} kneels {1} to kill {2}', player, this, card);

        return true;
    }
}

GreyWind.code = '01145';

module.exports = GreyWind;
