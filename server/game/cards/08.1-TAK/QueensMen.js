const DrawCard = require('../../drawcard.js');

class QueensMen extends DrawCard {
    setupCardAbilities() {
        this.reaction({
            when: {
                onCardEntersPlay: event => event.card === this && event.playingType === 'marshal'
            },
            chooseOpponent: opponent => opponent.hand.size() > 0,
            handler: context => {
                let opponent = context.opponent;

                this.chosenOpponent = opponent;

                let buttons = opponent.hand.map(card => {
                    return { card: card, method: 'cardSelected' };
                });

                buttons.push({ text: 'Done', method: 'doneSelected' });

                this.game.promptWithMenu(this.controller, this, {
                    activePrompt: {
                        menuTitle: 'Choose whether to discard a non-character card, or click done',
                        buttons: buttons
                    },
                    source: this
                });
            }
        });
    }

    cardSelected(player, cardId) {
        let toDiscard = this.game.findAnyCardInAnyList(cardId);
        let opponent = toDiscard.controller;
        this.game.addMessage('{0} uses {1} to look at {2}\'s hand', this.controller, this, opponent);

        if(toDiscard && toDiscard.getType() !== 'character' && this.controller.anyCardsInPlay(card => !card.isFaction('baratheon') && card.getType() === 'character' && !card.kneeled)) {
            this.game.promptForSelect(this.controller, {
                source: this,
                gameAction: 'kneel',
                cardCondition: card => card.location === 'play area' && card.controller === this.controller &&
                                       !card.isFaction('baratheon') && card.getType() === 'character',
                onSelect: (player, toKneel) => this.kneelToDiscard(player, toKneel, toDiscard)
            });
        }

        return true;
    }

    doneSelected() {
        this.game.addMessage('{0} uses {1} to look at {2}\'s hand', this.controller, this, this.chosenOpponent);
        return true;
    }

    kneelToDiscard(p, toKneel, toDiscard) {
        toKneel.controller.kneelCard(toKneel);
        toDiscard.owner.discardCard(toDiscard);
        this.game.addMessage('{0} then kneels {1} to discard {2} from {3}\'s hand',
            this.controller, toKneel, toDiscard, toDiscard.owner);

        return true;
    }
}

QueensMen.code = '08008';

module.exports = QueensMen;
