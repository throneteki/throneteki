import DrawCard from '../../drawcard.js';
import GameActions from '../../GameActions/index.js';

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
                onCardDiscarded: (event, context) =>
                    event.isPillage &&
                    (event.card.getType() === 'attachment' ||
                        event.card.getType() === 'location') &&
                    context.source.parent.allowGameAction('gainPower')
            },
            message: {
                format: '{player} uses {source} to have {parent} gain 1 power',
                args: { parent: (context) => context.source.parent }
            },
            gameAction: GameActions.gainPower((context) => ({
                card: context.source.parent,
                amount: 1
            }))
        });
    }
}

KingOfSaltAndRock.code = '04052';

export default KingOfSaltAndRock;
