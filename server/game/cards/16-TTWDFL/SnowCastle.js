import DrawCard from '../../drawcard.js';

class SnowCastle extends DrawCard {
    // Snow Castle (16012)
    // Action: Kneel Snow Castle to choose a [stark] character. Until the end of the phase, that
    // character gets +1 STR for each [stark] character you control.
    setupCardAbilities(ability) {
        const strength = (context) =>
            context.player.getNumberOfCardsInPlay({ faction: 'stark', type: 'character' });

        this.action({
            title: 'Give +STR',
            cost: ability.costs.kneelSelf(),
            target: {
                cardCondition: { location: 'play area', faction: 'stark', type: 'character' }
            },
            message: {
                format: '{player} kneels {source} to give {target} +{strength} STR',
                args: { strength }
            },
            handler: (context) => {
                this.untilEndOfPhase((ability) => ({
                    match: context.target,
                    effect: ability.effects.modifyStrength(strength(context))
                }));
            }
        });
    }
}

SnowCastle.code = '16012';

export default SnowCastle;
