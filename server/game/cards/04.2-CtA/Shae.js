import DrawCard from '../../drawcard.js';

class Shae extends DrawCard {
    setupCardAbilities(ability) {
        this.action({
            title: 'Stand Shae',
            phase: 'challenge',
            limit: ability.limit.perPhase(2),
            cost: ability.costs.payGold(1),
            handler: () => {
                this.controller.standCard(this);

                this.game.addMessage('{0} pays 1 gold to stand {1}', this.controller, this);
            }
        });
    }
}

Shae.code = '04029';

export default Shae;
