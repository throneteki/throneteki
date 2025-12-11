import DrawCard from '../../drawcard.js';

class SerOsfrydKettleblack extends DrawCard {
    setupCardAbilities(ability) {
        this.persistentEffect({
            condition: () =>
                this.game
                    .getOpponents(this.controller)
                    .every((player) => this.controller.getHandCount() > player.getHandCount()),
            match: this,
            effect: ability.effects.addKeyword('Renown')
        });
    }
}

SerOsfrydKettleblack.code = '26085';

export default SerOsfrydKettleblack;
