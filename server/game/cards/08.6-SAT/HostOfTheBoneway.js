import DrawCard from '../../drawcard.js';

class HostOfTheBoneway extends DrawCard {
    // Host of the Boneway (08115)
    // Intimidate. No attachments.
    // Host of the Boneway gets +1 STR for each plot card in your used pile.
    setupCardAbilities(ability) {
        this.persistentEffect({
            match: this,
            effect: ability.effects.dynamicStrength((card, context) =>
                context.source.controller.getNumberOfUsedPlots()
            )
        });
    }
}

HostOfTheBoneway.code = '08115';

export default HostOfTheBoneway;
