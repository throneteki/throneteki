import DrawCard from '../../drawcard.js';

class IronEmmett extends DrawCard {
    // Iron Emmett (24013)
    // Stealth.
    // While Iron Emmett is kneeling, characters with a [military] icon cannot enter play during the
    // challenges phase.
    setupCardAbilities(ability) {
        this.persistentEffect({
            targetController: 'any',
            condition: (context) =>
                context.source.kneeled && context.game.currentPhase === 'challenge',
            effect: ability.effects.cannotPutIntoPlay((card) => card.hasIcon('military'))
        });
    }
}

IronEmmett.code = '24013';

export default IronEmmett;
