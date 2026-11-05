import DrawCard from '../../drawcard.js';
import GameActions from '../../GameActions/index.js';

class MagnarofThenn extends DrawCard {
    // Magnar of Thenn (21028)
    // Unique Wildling character only.
    // Attached character gains the Lord trait and pillage.
    // Interrupt: When attached character would be killed, sacrifice another Wildling character to
    // save it.
    setupCardAbilities(ability) {
        this.attachmentRestriction({ trait: 'Wildling', unique: true });
        this.whileAttached({
            effect: [ability.effects.addKeyword('pillage'), ability.effects.addTrait('Lord')]
        });

        this.interrupt({
            canCancel: true,
            when: {
                onCharacterKilled: (event, context) =>
                    event.card === context.source.parent &&
                    context.source.parent.canBeSaved() &&
                    event.allowSave
            },
            cost: ability.costs.sacrifice(
                (card, context) =>
                    card.hasTrait('Wildling') &&
                    card.getType() === 'character' &&
                    card !== context.source.parent
            ),
            message: {
                format: '{player} uses {source} and sacrifices {costs.sacrifice} to save {parent}',
                args: { parent: (context) => context.cardStateWhenInitiated.parent }
            },
            gameAction: GameActions.saveCard((context) => ({ event: context.event }))
        });
    }
}

MagnarofThenn.code = '21028';

export default MagnarofThenn;
