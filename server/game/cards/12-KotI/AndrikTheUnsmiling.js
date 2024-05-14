const DrawCard = require('../../drawcard.js');

class AndrikTheUnsmiling extends DrawCard {
    setupCardAbilities() {
        this.reaction({
            when: {
                onCardDiscarded: (event) =>
                    event.isPillage &&
                    this.game.currentChallenge.winner === this.controller &&
                    event.source === this
            },
            target: {
                activePromptTitle: 'Select location',
                cardCondition: (card) => this.cardCondition(card)
            },
            handler: (context) => {
                this.game.promptForSelect(this.controller, {
                    activePromptTitle: 'Select a copy of ' + context.target.name,
                    source: this,
                    cardCondition: (card) =>
                        card.location === 'play area' && card.isCopyOf(context.target),
                    onSelect: (player, card) => this.onCardSelected(player, card)
                });
            }
        });
    }

    cardCondition(card) {
        return (
            card.controller === this.game.currentChallenge.loser &&
            !card.isLimited() &&
            ['location', 'attachment'].includes(card.getType()) &&
            card.location === 'discard pile'
        );
    }

    onCardSelected(player, card) {
        card.controller.discardCard(card);

        this.game.addMessage('{0} uses {1} to discard a copy of {2} from play', player, this, card);

        return true;
    }
}

AndrikTheUnsmiling.code = '12008';

module.exports = AndrikTheUnsmiling;
