import DrawCard from '../../drawcard.js';

class Dywen extends DrawCard {
    // Dywen (18009)
    // Stealth.
    // Each [thenightswatch] character you control with stealth does not kneel when declared as an
    // attacker during a [military] challenge.
    // +1 Reserve.
    setupCardAbilities(ability) {
        this.plotModifiers({
            reserve: 1
        });

        this.persistentEffect({
            //the condition is somehow necessary to reapply the effect to cards entering play after Dywen
            condition: () => true,
            match: (card) =>
                card.controller === this.controller &&
                card.isFaction('thenightswatch') &&
                card.getType() === 'character' &&
                card.hasKeyword('Stealth'),
            effect: ability.effects.doesNotKneelAsAttacker({ challengeType: 'military' })
        });
    }
}

Dywen.code = '18009';

export default Dywen;
