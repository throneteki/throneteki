const DrawCard = require('../../../drawcard.js');

class BloodOfMyBlood extends DrawCard {
    setupCardAbilities() {
        this.action({
            title: 'Search deck for Bloodrider',
            phase: 'challenge',
            handler: () => {
                this.game.promptForDeckSearch(this.controller, {
                    activePromptTitle: 'Select a card to put it in play',
                    cardCondition: card => card.getType() === 'character' && card.hasTrait('Bloodrider') && this.controller.canPutIntoPlay(card),
                    onSelect: (player, card) => this.cardSelected(player, card),
                    onCancel: player => this.doneSelecting(player),
                    source: this
                });
            }
        });
    }

    cardSelected(player, card) {
        player.putIntoPlay(card);

        this.atEndOfPhase(ability => ({
            match: card,
            effect: ability.effects.returnToHandIfStillInPlay(true)
        }));

        this.game.addMessage('{0} uses {1} to search their deck and put {2} into play',
            player, this, card);
    }

    doneSelecting(player) {
        this.game.addMessage('{0} uses {1} to search their deck, but does not put any card into play',
            player, this);
    }
}

BloodOfMyBlood.code = '04054';

module.exports = BloodOfMyBlood;
