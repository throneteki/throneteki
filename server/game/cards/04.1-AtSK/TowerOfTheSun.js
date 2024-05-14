import DrawCard from '../../drawcard.js';

class TowerOfTheSun extends DrawCard {
    setupCardAbilities(ability) {
        this.reaction({
            when: {
                onCardPlayed: () => this.controller.canGainGold()
            },
            limit: ability.limit.perPhase(1),
            handler: () => {
                this.game.addGold(this.controller, 1);
                this.game.addMessage('{0} uses {1} to gain 1 gold', this.controller, this);
            }
        });
    }
}

TowerOfTheSun.code = '04017';

export default TowerOfTheSun;
