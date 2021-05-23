const DrawCard = require('../../drawcard.js');

class EuronCrowsEye extends DrawCard {
    setupCardAbilities(ability) {
        this.persistentEffect({
            condition: () => this.hasAnotherRaider(),
            match: this,
            effect: ability.effects.addKeyword('intimidate')
        });
        this.reaction({
            when: {
                onCardEntersPlay: event => event.card === this
            },
            choices: {
                'Put Warship into play': context => {
                    this.game.promptForSelect(context.player, {
                        cardCondition: card => card.getType() === 'location' && card.location === 'hand' && card.hasTrait('Warship') && this.controller.canPutIntoPlay(card),
                        source: this,
                        onSelect: (player, card) => this.warshipSelected(player, card)
                    });
                },
                'Search for Silence': context => {
                    this.game.promptForDeckSearch(context.player, {
                        activePromptTitle: 'Select a card',
                        cardCondition: card => card.name === 'Silence',
                        onSelect: (player, card) => this.silenceSelected(player, card),
                        onCancel: player => this.doneSelecting(player),
                        source: this
                    });
                }
            }
        });
    }

    warshipSelected(player, card) {
        player.putIntoPlay(card);
        this.game.addMessage('{0} uses {1} to put {2} into play from their hand', player, this, card);
        return true;
    }

    silenceSelected(player, card) {
        this.game.addMessage('{0} uses {1} to search their deck and add {2} to their hand', player, this, card);
        player.moveCard(card, 'hand');
        return true;
    }

    doneSelecting(player) {
        this.game.addMessage('{0} uses {1} to search their deck, but does not add any card to their hand', player, this);
    }

    hasAnotherRaider() {
        let cards = this.controller.filterCardsInPlay(card => card.getType() === 'character' && card.hasTrait('Raider') && card !== this);
        return cards.length > 0;
    }
}

EuronCrowsEye.code = '17103';

module.exports = EuronCrowsEye;
