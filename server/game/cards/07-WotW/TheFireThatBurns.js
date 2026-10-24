import PlotCard from '../../plotcard.js';

class TheFireThatBurns extends PlotCard {
    // The Fire That Burns (07046)
    // Each [thenightswatch] character you control does not kneel when declared as a defender.
    setupCardAbilities(ability) {
        this.persistentEffect({
            match: (card) => card.isFaction('thenightswatch') && card.getType() === 'character',
            effect: ability.effects.doesNotKneelAsDefender()
        });
    }
}

TheFireThatBurns.code = '07046';

export default TheFireThatBurns;
