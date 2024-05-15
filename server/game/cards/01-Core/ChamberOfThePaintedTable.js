import DrawCard from '../../drawcard.js';

class ChamberOfThePaintedTable extends DrawCard {
    setupCardAbilities(ability) {
        this.reaction({
            when: {
                onDominanceDetermined: (event) =>
                    this.controller === event.winner && this.opponentHasPower()
            },
            cost: ability.costs.kneelSelf(),
            handler: () => {
                let opponents = this.game
                    .getOpponents(this.controller)
                    .filter((opponent) => opponent.faction.power > 0);

                if (opponents.length === 0) {
                    return;
                }

                if (opponents.length === 1) {
                    this.stealPowerFromOpponent(opponents[0]);
                    return;
                }

                let factionCards = opponents.map((opponent) => opponent.faction);

                this.game.promptForSelect(this.controller, {
                    activePromptTitle: 'Select a faction card',
                    cardCondition: (card) => factionCards.includes(card),
                    cardType: 'faction',
                    onSelect: (player, card) => this.stealPowerFromOpponent(card.owner)
                });
            }
        });
    }

    stealPowerFromOpponent(opponent) {
        this.game.addMessage(
            "{0} kneels {1} to move 1 power from {2}'s faction card to their own",
            this.controller,
            this,
            opponent
        );
        this.game.movePower(opponent.faction, this.controller.faction, 1);
        return true;
    }

    opponentHasPower() {
        let opponents = this.game.getOpponents(this.controller);
        return opponents.some((opponent) => opponent.faction.power > 0);
    }
}

ChamberOfThePaintedTable.code = '01060';

export default ChamberOfThePaintedTable;
