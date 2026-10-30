import DrawCard from '../../drawcard.js';

class GreatjonsVanguard extends DrawCard {
    // Greatjon's Vanguard (02081)
    // No attachments.
    // While there are fewer than 3 plots in your used pile, Greatjon's Vanguard gets +2 STR and
    // gains renown.
    setupCardAbilities(ability) {
        this.persistentEffect({
            condition: (context) => context.source.controller.getNumberOfUsedPlots() <= 2,
            match: this,
            effect: [ability.effects.modifyStrength(2), ability.effects.addKeyword('Renown')]
        });
    }
}

GreatjonsVanguard.code = '02081';

export default GreatjonsVanguard;
