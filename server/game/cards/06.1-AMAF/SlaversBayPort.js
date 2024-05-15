import DrawCard from '../../drawcard.js';

class SlaversBayPort extends DrawCard {
    setupCardAbilities(ability) {
        this.action({
            title: 'Gain gold',
            phase: 'marshal',
            condition: () => this.controller.canGainGold(),
            cost: ability.costs.kneelSelf(),
            handler: (context) => {
                let gold = this.opponentDeadPileHas4() ? 2 : 1;
                gold = this.game.addGold(context.player, gold);

                this.game.addMessage('{0} kneels {1} to gain {2} gold', context.player, this, gold);
            }
        });
    }

    opponentDeadPileHas4() {
        let opponents = this.game.getOpponents(this.controller);
        return opponents.some((opponent) => opponent.deadPile.length >= 4);
    }
}

SlaversBayPort.code = '06014';

export default SlaversBayPort;
