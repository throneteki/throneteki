import DrawCard from '../../drawcard.js';

class SmalljonUmber extends DrawCard {
    setupCardAbilities(ability) {
        this.persistentEffect({
            match: this,
            effect: ability.effects.dynamicDecreaseStrength(() =>
                this.controller.getNumberOfUsedPlots()
            )
        });
    }
}

SmalljonUmber.code = '13021';

export default SmalljonUmber;
