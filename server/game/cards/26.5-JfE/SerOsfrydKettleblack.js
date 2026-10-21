import DrawCard from '../../drawcard.js';

class SerOsfrydKettleblack extends DrawCard {
    // Ser Osfryd Kettleblack (26085)
    // While you have more cards in hand than each opponent, Ser Osfryd Kettleblack gains renown.
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
