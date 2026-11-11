import PlotCard from '../../plotcard.js';

class GrandMelee extends PlotCard {
    // Grand Melee (10051)
    // Each character that is attacking or defending alone does not contribute its STR to the
    // challenge.
    setupCardAbilities(ability) {
        this.persistentEffect({
            // Add always-on condition so that attacking / defending alone is
            // rechecked after participants are added or removed from challenges
            condition: () => true,
            match: (card, context) =>
                context.game.isDuringChallenge({ attackingAlone: card }) ||
                context.game.isDuringChallenge({ defendingAlone: card }),
            targetController: 'any',
            effect: ability.effects.doesNotContributeStrength()
        });
    }
}

GrandMelee.code = '10051';

export default GrandMelee;
