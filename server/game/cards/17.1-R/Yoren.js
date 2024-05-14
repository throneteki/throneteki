const DrawCard = require('../../drawcard.js');

class Yoren extends DrawCard {
    setupCardAbilities() {
        this.reaction({
            when: {
                onCardEntersPlay: (event) => event.card === this
            },
            chooseOpponent: (opponent) =>
                opponent.anyCardsInPlay(
                    (card) =>
                        card.getType() === 'character' &&
                        !card.kneeled &&
                        card.getPrintedCost() <= 5
                ),
            handler: (context) => {
                this.game.addMessage(
                    '{0} uses {1} to choose {2}',
                    context.player,
                    this,
                    context.opponent
                );
                this.game.promptForSelect(context.opponent, {
                    acticePromptTitle: 'Select a character',
                    source: this,
                    cardCondition: (card) =>
                        card.getType() === 'character' &&
                        card.controller === context.opponent &&
                        card.getPrintedCost() <= 5 &&
                        card.location === 'play area' &&
                        !card.kneeled,
                    onSelect: (player, card) => this.onCardSelected(player, card),
                    onCancel: (player) => this.onCancel(player)
                });
            }
        });
    }

    onCardSelected(player, card) {
        this.lastingEffect((ability) => ({
            until: {
                onCardLeftPlay: (event) => event.card === this || event.card === card
            },
            match: card,
            effect: ability.effects.takeControl(this.controller)
        }));

        return true;
    }

    onCancel(player) {
        this.game.addAlert('danger', '{0} did not select a character for {1}', player, this);

        return true;
    }
}

Yoren.code = '17116';

module.exports = Yoren;
