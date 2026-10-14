import DrawCard from '../../drawcard.js';

class GreyWorm extends DrawCard {
    setupCardAbilities(ability) {
        this.persistentEffect({
            condition: () =>
                this.game.currentChallenge &&
                this.controller.getHandCount() <
                    this.game.currentChallenge.attackingPlayer.getHandCount(),
            match: this,
            effect: ability.effects.doesNotKneelAsDefender()
        });
    }
}

GreyWorm.code = '00253';

export default GreyWorm;
