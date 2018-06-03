const DrawCard = require('../../drawcard');

class AegonTargaryen extends DrawCard {
    setupCardAbilities() {
        this.reaction({
            when: {
                onCardEntersPlay: event => event.card === this
            },
            handler: () => {
                this.game.promptForDeckSearch(this.controller, {
                    activePromptTitle: 'Select a character',
                    cardCondition: card => card.getType() === 'character' && (card.hasTrait('Mercenary') || card.hasTrait('Army')),
                    onSelect: (player, card) => this.cardSelected(card),
                    onCancel: () => this.doneSelecting(),
                    source: this
                });
            }
        });
    }

    cardSelected(card) {
        this.game.addMessage('{0} uses {1} to search their deck and put {2} into play', this.controller, this, card);
        this.controller.putIntoPlay(card);
        this.atEndOfPhase(ability => ({
            match: card,
            effect: ability.effects.returnToHandIfStillInPlay(true)
        }));
    }

    doneSelecting() {
        this.game.addMessage('{0} uses {1} to search their deck but does not put a card into play', this.controller, this);
        return true;
    }
}

AegonTargaryen.code = '11014';

module.exports = AegonTargaryen;
