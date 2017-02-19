const DrawCard = require('../../../drawcard.js');

class AryaStark extends DrawCard {
    setupCardAbilities() {
        this.reaction({
            when: {
                onCharacterKilled: (event, player, card) => (
                    this.controller === card.controller &&
                    card.getFaction() === this.getFaction())
            },
            handler: () => {
                this.game.promptForSelect(this.controller, {
                    cardCondition: card => (
                        card.location === 'play area' && 
                        card.getType() === 'character' &&
                        card.getStrength() <= 3),
                    activePromptTitle: 'Select a character',
                    waitingPromptTitle: 'Waiting for opponent to use ' + this.name,
                    onSelect: (player, card) => this.onCardSelected(player, card)
                });
            }
        });
    }

    onCardSelected(player, card) {
        this.controller.sacrificeCard(this);
        card.controller.killCard(card);
        this.game.addMessage('{0} sacrifices {1} to kill {2}', player, this, card);

        return true;
    }
}

AryaStark.code = '03007';

module.exports = AryaStark;
