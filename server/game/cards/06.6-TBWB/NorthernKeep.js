import DrawCard from '../../drawcard.js';

class NorthernKeep extends DrawCard {
    // Northern Keep (06102)
    // Limited.
    // Marshaling Action: Kneel Northern Keep to gain 1 gold. (2 gold instead if there are more
    // Winter plot cards than Summer plot cards revealed.)
    setupCardAbilities(ability) {
        this.action({
            title: 'Gain gold',
            phase: 'marshal',
            condition: () => this.controller.canGainGold(),
            cost: ability.costs.kneelSelf(),
            handler: (context) => {
                let gold = this.moreWinterThanSummerPlotsRevealed() ? 2 : 1;
                gold = this.game.addGold(context.player, gold);

                this.game.addMessage('{0} kneels {1} to gain {2} gold', context.player, this, gold);
            }
        });
    }

    moreWinterThanSummerPlotsRevealed() {
        let winterPlots = this.game.getNumberOfPlotsWithTrait('Winter');
        let summerPlots = this.game.getNumberOfPlotsWithTrait('Summer');

        return winterPlots > summerPlots;
    }
}

NorthernKeep.code = '06102';

export default NorthernKeep;
