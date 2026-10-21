import DrawCard from '../../drawcard.js';

class BryndensOutriders extends DrawCard {
    // Brynden's Outriders (21017)
    // Assault. No attachments.
    // While you control a The Riverlands location, Brynden's Outriders gains stealth.
    // While you control a Commander character, Brynden's Outriders gains a [power] icon.
    setupCardAbilities(ability) {
        this.persistentEffect({
            condition: () => this.controller.anyCardsInPlay((card) => card.hasTrait('Commander')),
            match: this,
            effect: ability.effects.addIcon('power')
        });

        this.persistentEffect({
            condition: () =>
                this.controller.anyCardsInPlay((card) => card.hasTrait('The Riverlands')),
            match: this,
            effect: ability.effects.addKeyword('stealth')
        });
    }
}

BryndensOutriders.code = '21017';

export default BryndensOutriders;
