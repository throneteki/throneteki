import PlotCard from '../../plotcard.js';

class ForgottenPlans extends PlotCard {
    // Forgotten Plans (02119)
    // While it is not the plot phase, treat the text box of each revealed non-Scheme plot card as
    // if it were blank (except for Traits).
    setupCardAbilities(ability) {
        this.persistentEffect({
            condition: () => this.game.currentPhase !== 'plot',
            match: (card) => card.getType() === 'plot' && !card.hasTrait('Scheme'),
            targetController: 'any',
            effect: ability.effects.blankExcludingTraits
        });
    }
}

ForgottenPlans.code = '02119';

export default ForgottenPlans;
