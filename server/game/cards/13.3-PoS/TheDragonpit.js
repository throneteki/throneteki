import DrawCard from '../../drawcard.js';

class TheDragonpit extends DrawCard {
    setupCardAbilities(ability) {
        this.persistentEffect({
            // Add an explicit condition so the effect gets recalculated as the
            // number of shadow cards change.
            condition: () =>
                this.game
                    .getOpponents()
                    .some((opponent) => opponent.shadows.length < this.controller.shadows.length),
            match: (card) =>
                card.location === 'play area' &&
                card.getType() === 'character' &&
                this.controllerHasFewerShadows(card),
            targetController: 'any',
            effect: ability.effects.modifyStrength(-1)
        });
    }

    controllerHasFewerShadows(card) {
        return (
            card.controller !== this.controller &&
            card.controller.shadows.length < this.controller.shadows.length
        );
    }
}

TheDragonpit.code = '13054';

export default TheDragonpit;
