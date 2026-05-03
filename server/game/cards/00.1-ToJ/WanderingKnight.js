import DrawCard from '../../drawcard.js';

class WanderingKnight extends DrawCard {
    setupCardAbilities(ability) {
        this.persistentEffect({
            match: (card) => card === this,
            effect: ability.effects.dynamicStrength(() => this.getNumberOfNonLimitedLocations())
        });
        this.persistentEffect({
            condition: () => this.getStrength() >= 5,
            match: this,
            effect: ability.effects.addIcon('power')
        });
    }

    getNumberOfNonLimitedLocations() {
        return this.controller.getNumberOfCardsInPlay(
            (card) => card.getType() === 'location' && !card.isLimited()
        );
    }
}

WanderingKnight.code = '00351';

export default WanderingKnight;
