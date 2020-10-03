const DrawCard = require('../../drawcard.js');
const GameActions = require('../../GameActions');

class DaenerysTargaryen extends DrawCard {
    setupCardAbilities(ability) {
        this.action({
            title: 'Search deck',
            cost: ability.costs.kneelFactionCard(),
            handler: context => {
                this.game.promptForDeckSearch(this.controller, {
                    numCards: 10,
                    activePromptTitle: 'Select a card',
                    cardCondition: card => (card.hasTrait('Title') || card.hasTrait('Dragon')) && this.controller.canPutIntoPlay(card),
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
                        effect: ability.effects.returnToHandIfStillInPlayAndNotAttachedToCardByTitle('Daenerys Targaryen', false)
                    }));
                }
            }),
            context
        );

        return true;
    }

    doneSelecting(player) {
        this.game.addMessage('{0} uses {1} to search their deck, but does not put any cards in play',
            player, this);
        
        return true;
    }
}

DaenerysTargaryen.code = '17128';

DaenerysTargaryen.cardData = {
    "text": "<b>Action:</b>Kneel your faction card to search the top 10 cards of your deck for a <i>Dragon</i> or <i>Title</i> card and put it into play. Shuffle your deck. At the end of the phase, if that card is still in play and not attached to Daenerys Targaryen, return it to your hand (cannot be saved)."
};

module.exports = DaenerysTargaryen;
