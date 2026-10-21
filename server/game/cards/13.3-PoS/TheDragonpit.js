import DrawCard from '../../drawcard.js';

class TheDragonpit extends DrawCard {
    // The Dragonpit (13054)
    // Each character whose controller controls fewer cards in shadows than you gets -1 STR.
    setupCardAbilities(ability) {
        this.persistentEffect({
            // Add an explicit condition so the effect gets recalculated as the
            // number of shadow cards change.
            condition: (context) =>
                context.game
                    .getOpponents()
                    .some(
                        (opponent) =>
                            opponent.shadows.length < context.source.controller.shadows.length
                    ),
            match: (card, context) =>
                card.location === 'play area' &&
                card.getType() === 'character' &&
                context.source.controllerHasFewerShadows(card),
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
