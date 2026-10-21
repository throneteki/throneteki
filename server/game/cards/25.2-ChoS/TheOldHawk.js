import DrawCard from '../../drawcard.js';

class TheOldHawk extends DrawCard {
    // The Old Hawk (25027)
    // Insight.
    // While there is a Summer plot card revealed, each [martell] character you control with STR 6
    // or higher gains renown.
    setupCardAbilities(ability) {
        this.persistentEffect({
            condition: (context) => context.game.anyPlotHasTrait('Summer'),
            match: (card) =>
                card.getType() === 'character' &&
                card.isFaction('martell') &&
                card.getStrength() >= 6,
            effect: ability.effects.addKeyword('renown')
        });
    }
}

TheOldHawk.code = '25027';

export default TheOldHawk;
