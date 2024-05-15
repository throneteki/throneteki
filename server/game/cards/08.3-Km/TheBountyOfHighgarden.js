import DrawCard from '../../drawcard.js';

class TheBountyOfHighgarden extends DrawCard {
    setupCardAbilities() {
        this.action({
            title: 'Gain 5 gold',
            condition: () => this.controller.canGainGold(),
            cannotBeCanceled: true,
            handler: (context) => {
                let gold = this.game.addGold(context.player, 5);
                this.game.addMessage('{0} plays {1} to gain {2} gold', context.player, this, gold);
            }
        });
    }
}

TheBountyOfHighgarden.code = '08044';

export default TheBountyOfHighgarden;
