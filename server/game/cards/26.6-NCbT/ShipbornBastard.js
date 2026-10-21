import DrawCard from '../../drawcard.js';

class ShipbornBastard extends DrawCard {
    // Shipborn Bastard (26103)
    // X is the number of cards you control with initiative modifiers.
    // +1 Initiative.
    setupCardAbilities(ability) {
        this.plotModifiers({
            initiative: 1
        });
        this.persistentEffect({
            match: this,
            effect: ability.effects.dynamicStrength(() => this.getSTR())
        });
    }

    getSTR() {
        return this.controller.getNumberOfCardsInPlay(
            (card) => !!card.printedPlotModifiers.initiative
        );
    }
}

ShipbornBastard.code = '26103';

export default ShipbornBastard;
