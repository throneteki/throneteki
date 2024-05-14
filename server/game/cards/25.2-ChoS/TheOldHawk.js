import DrawCard from '../../drawcard.js';

class TheOldHawk extends DrawCard {
    setupCardAbilities(ability) {
        this.persistentEffect({
            condition: () => this.game.anyPlotHasTrait('Summer'),
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
