const DrawCard = require('../../drawcard');

class Hardhome extends DrawCard {
    setupCardAbilities(ability) {
        this.action({
            title: 'Force opponent to sacrifice',
            phase: 'dominance',
            cost: [ability.costs.kneelSelf(), ability.costs.sacrificeSelf()],
            chooseOpponent: (opponent) =>
                opponent.anyCardsInPlay((card) => card.getType() === 'character' && !card.kneeled),
            handler: (context) => {
                this.game.addMessage(
                    '{0} kneels and sacrifices {1} to force {2} to choose a standing character to sacrifice',
                    context.player,
                    this,
                    context.opponent
                );
                this.game.promptForSelect(context.opponent, {
                    cardCondition: (card) =>
                        card.controller === context.opponent &&
                        card.location === 'play area' &&
                        card.getType() === 'character' &&
                        !card.kneeled,
                    gameAction: 'sacrifice',
                    onSelect: (player, card) => this.cardSelected(player, card),
                    onCancel: (player) => this.doneSelecting(player),
                    source: this
                });
            }
        });
    }

    cardSelected(player, card) {
        this.game.addMessage('{0} sacrifices {1} for {2}', player, card, this);
        player.sacrificeCard(card);
        return true;
    }

    doneSelecting(player) {
        this.game.addAlert('danger', '{0} cancels the resolution of {1}', player, this);
        return true;
    }
}

Hardhome.code = '11086';

module.exports = Hardhome;
