import DrawCard from '../../drawcard.js';

class DoranMartell extends DrawCard {
    // Doran Martell (01105)
    // Insight.
    // Each other [martell] Lord and Lady character you control gets +1 STR for each plot card in
    // your used pile.
    setupCardAbilities(ability) {
        this.persistentEffect({
            match: (card) =>
                card.isFaction('martell') &&
                card !== this &&
                (card.hasTrait('Lord') || card.hasTrait('Lady')),
            effect: ability.effects.dynamicStrength(() => this.controller.getNumberOfUsedPlots())
        });
    }
}

DoranMartell.code = '01105';

export default DoranMartell;
