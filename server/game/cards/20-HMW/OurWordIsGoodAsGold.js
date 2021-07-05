const DrawCard = require('../../drawcard.js');

class OurWordIsGoodAsGold extends DrawCard {
    setupCardAbilities() {
        this.action({
            title: 'Search deck for Mercenary',
            handler: context => {
                this.game.promptForDeckSearch(context.player, {
                    numCards: 10,
                    activePromptTitle: 'Select a card',
                    cardCondition: card => card.getType() === 'character' && card.hasTrait('Mercenary') && context.player.canPutIntoPlay(card),
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
            condition: () => ['play area', 'duplicate'].includes(card.location),
            targetLocation: 'any',
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

OurWordIsGoodAsGold.code = '20033';

module.exports = OurWordIsGoodAsGold;
