import PlotCard from '../../plotcard.js';

class GrandMelee extends PlotCard {
    setupCardAbilities(ability) {
        this.persistentEffect({
            // Add always-on condition so that attacking / defending alone is
            // rechecked after participants are added or removed from challenges
            condition: () => true,
            match: (card) =>
                this.game.isDuringChallenge({ attackingAlone: card }) ||
                this.game.isDuringChallenge({ defendingAlone: card }),
            targetController: 'any',
            effect: ability.effects.doesNotContributeStrength()
        });
    }
}

GrandMelee.code = '10051';

export default GrandMelee;
