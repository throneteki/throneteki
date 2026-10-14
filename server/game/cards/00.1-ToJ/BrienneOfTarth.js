import DrawCard from '../../drawcard.js';

class BrienneOfTarth extends DrawCard {
    setupCardAbilities(ability) {
        this.persistentEffect({
            condition: () =>
                this.controller.anyCardsInPlay(
                    (card) => card.parent === this && card.getType() === 'attachment'
                ),
            match: this,
            effect: [
                ability.effects.addKeyword('Renown'),
                ability.effects.dynamicStrength(() => this.attachments.length)
            ]
        });
    }
}

BrienneOfTarth.code = '00295';

export default BrienneOfTarth;
