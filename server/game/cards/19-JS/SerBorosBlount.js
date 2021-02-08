const DrawCard = require('../../drawcard.js');
const GameActions = require('../../GameActions');

class SerBorosBlount extends DrawCard {
    setupCardAbilities() {
        this.reaction({
            when: {
                onCardEntersPlay: event => event.card === this
            },
            handler: context => {
                this.game.promptForDeckSearch(context.player, {
                    numCards: 10,
                    activePromptTitle: 'Select a card',
                    cardCondition: card => card.getType() === 'character' && (card.hasTrait('Kingsguard') || (card.hasTrait('Knight') && !card.isFaction('lannister'))) && context.player.canPutIntoPlay(card),
                    onSelect: (player, card) => this.cardSelected(player, card, context),
                    onCancel: player => this.doneSelecting(player),
                    source: this
                });
            }
        });
    }

    cardSelected(player, card, context) {
        this.game.addMessage('{0} uses {1} to search their deck and put {2} into play', player, this, card);
        this.game.resolveGameAction(
            GameActions.putIntoPlay(() => ({
                card: card
            })).then({
                condition: card.location === 'play area',
                handler: () => {
                    this.atEndOfPhase(ability => ({
                        match: card,
                        effect: ability.effects.discardIfStillInPlay(true)
                    }));
                }
            }),
            context
        );

        return true;
    }

    doneSelecting(player) {
        this.game.addMessage('{0} uses {1} to search their deck, but does not put any cards into play',
            player, this);
        
        return true;
    }
}

SerBorosBlount.code = '19006';

module.exports = SerBorosBlount;
