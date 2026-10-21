import DrawCard from '../../drawcard.js';

class TowerOfTheSun extends DrawCard {
    // Tower of the Sun (04017)
    // Reaction: After an event is played, gain 1 gold. (Limit once per phase.)
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
