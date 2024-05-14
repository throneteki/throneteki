import DrawCard from '../../drawcard.js';

class HauntedForestScout extends DrawCard {
    setupCardAbilities(ability) {
        this.persistentEffect({
            match: this,
            effect: ability.effects.cannotBeDeclaredAsDefender()
        });
        this.persistentEffect({
            condition: () => this.getNumberOfRangers() >= 3,
            match: this,
            effect: ability.effects.doesNotKneelAsAttacker()
        });
    }

    getNumberOfRangers() {
        return this.controller.getNumberOfCardsInPlay(
            (card) => card.getType() === 'character' && card.hasTrait('Ranger')
        );
    }
}

HauntedForestScout.code = '08045';

export default HauntedForestScout;
