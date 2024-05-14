const DrawCard = require('../../drawcard.js');

class BrokenVows extends DrawCard {
    setupCardAbilities() {
        this.action({
            title: 'Exchange characters',
            phase: 'marshal',
            chooseOpponent: () => true,
            target: {
                type: 'select',
                cardCondition: (card) =>
                    card.location === 'play area' &&
                    card.getType() === 'character' &&
                    card.controller === this.controller &&
                    card.isFaction('thenightswatch')
            },
            handler: (context) => {
                this.game.takeControl(context.opponent, context.target);
                this.game.promptForSelect(this.controller, {
                    cardCondition: (card) =>
                        card.location === 'play area' &&
                        card.getType() === 'character' &&
                        card.controller === context.opponent &&
                        card.getPrintedCost() < context.target.getPrintedCost() &&
                        !card.isLoyal() &&
                        this.controller.canControl(card),
                    onSelect: (player, card) => this.resolveAbility(context, card),
                    onCancel: () => this.resolveAbility(context, null),
                    source: this
                });
            }
        });
    }

    resolveAbility(context, opponentCard) {
        if (opponentCard) {
            this.game.addMessage(
                '{0} uses {1} to give control of {2} to {3} and take control of {4}',
                this.controller,
                this,
                context.target,
                context.opponent,
                opponentCard
            );
            this.game.takeControl(this.controller, opponentCard);
        } else {
            this.game.addMessage(
                '{0} uses {1} to give control of {2} to {3}',
                this.controller,
                this,
                context.target,
                context.opponent
            );
        }

        return true;
    }
}

BrokenVows.code = '09034';

module.exports = BrokenVows;
