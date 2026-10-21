import DrawCard from '../../drawcard.js';

class SmalljonUmber extends DrawCard {
    // Smalljon Umber (13021)
    // Renown.
    // Smalljon Umber gets -1 STR for each plot card in your used pile.
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
