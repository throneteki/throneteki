const DrawCard = require('../../drawcard');

class Sparrows extends DrawCard {
    setupCardAbilities() {
        this.reaction({
            when: {
                onCardOutOfShadows: (event) => event.card === this && this.opponentHasPower()
            },
            target: {
                cardCondition: (card) =>
                    card.location === 'play area' &&
                    card !== this &&
                    card.hasTrait('The Seven') &&
                    card.controller === this.controller
            },
            handler: (context) => {
                let opponents = this.game
                    .getOpponents(this.controller)
                    .filter((opponent) => opponent.faction.power > 0);

                if (opponents.length === 0) {
                    return;
                }

                if (opponents.length === 1) {
                    this.stealPowerFromOpponent(opponents[0], context.target);
                    return;
                }

                let factionCards = opponents.map((opponent) => opponent.faction);

                this.game.promptForSelect(this.controller, {
                    activePromptTitle: 'Select a faction card',
                    cardCondition: (card) => factionCards.includes(card),
                    cardType: 'faction',
                    onSelect: (player, card) =>
                        this.stealPowerFromOpponent(card.owner, context.target),
                    source: this
                });
            }
        });
    }

    stealPowerFromOpponent(opponent, targetCard) {
        this.game.addMessage(
            "{0} uses {3} to move 1 power from {1}'s faction card to {2}",
            this.controller,
            opponent,
            targetCard,
            this
        );
        this.game.movePower(opponent.faction, targetCard, 1);
        return true;
    }

    opponentHasPower() {
        let opponents = this.game.getOpponents(this.controller);
        return opponents.some((opponent) => opponent.faction.power > 0);
    }
}

Sparrows.code = '13097';

module.exports = Sparrows;
