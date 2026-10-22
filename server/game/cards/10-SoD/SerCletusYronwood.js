import DrawCard from '../../drawcard.js';

class SerCletusYronwood extends DrawCard {
    // Ser Cletus Yronwood (10012)
    // No attachments except Weapon.
    // Increase the initiative value on your revealed plot card by 1 for each plot card in your used
    // pile.
    setupCardAbilities(ability) {
        this.persistentEffect({
            match: (card) => card === card.controller.activePlot,
            effect: ability.effects.modifyInitiative((card, context) =>
                context.source.controller.getNumberOfUsedPlots()
            )
        });
    }
}

SerCletusYronwood.code = '10012';

export default SerCletusYronwood;
