import DrawCard from '../../drawcard.js';

class GreyWorm extends DrawCard {
    setupCardAbilities(ability) {
        this.persistentEffect({
            condition: () =>
                this.game.currentChallenge &&
                this.controller.hand.length <
                    this.game.currentChallenge.attackingPlayer.hand.length,
            match: this,
            effect: ability.effects.doesNotKneelAsDefender()
        });
    }
}

GreyWorm.code = '19013';

export default GreyWorm;
