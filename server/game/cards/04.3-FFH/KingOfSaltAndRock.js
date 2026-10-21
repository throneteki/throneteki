import DrawCard from '../../drawcard.js';

class KingOfSaltAndRock extends DrawCard {
    // King of Salt and Rock (04052)
    // Ironborn character only.
    // Attached character gains the King trait and pillage.
    // Reaction: After an attachment or location is discarded using pillage, attached character
    // gains 1 power.
    setupCardAbilities(ability) {
        this.attachmentRestriction({ trait: 'Ironborn' });
        this.whileAttached({
            effect: [ability.effects.addTrait('King'), ability.effects.addKeyword('Pillage')]
        });
        this.reaction({
            when: {
                onCardDiscarded: (event) =>
                    event.isPillage &&
                    (event.card.getType() === 'attachment' ||
                        event.card.getType() === 'location') &&
                    this.parent.allowGameAction('gainPower')
            },
            handler: () => {
                this.parent.modifyPower(1);
                this.game.addMessage(
                    '{0} uses {1} to have {2} gain 1 power',
                    this.controller,
                    this,
                    this.parent
                );
            }
        });
    }
}

KingOfSaltAndRock.code = '04052';

export default KingOfSaltAndRock;
