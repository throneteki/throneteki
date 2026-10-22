import DrawCard from '../../drawcard.js';
import GameActions from '../../GameActions/index.js';

class BodyGuard extends DrawCard {
    // Bodyguard (01033)
    // Lord or Lady character only.
    // Interrupt: When attached character would be killed or discarded from play, sacrifice
    // Bodyguard to save that character.
    setupCardAbilities(ability) {
        this.attachmentRestriction({ trait: ['Lord', 'Lady'] });
        this.interrupt({
            canCancel: true,
            when: {
                onCharacterKilled: (event, context) =>
                    event.card === context.source.parent &&
                    context.source.parent.canBeSaved() &&
                    event.allowSave,
                onCardDiscarded: (event, context) =>
                    event.card === context.source.parent &&
                    context.source.parent.canBeSaved() &&
                    event.allowSave
            },
            cost: ability.costs.sacrificeSelf(),
            message: {
                format: '{player} sacrifices {source} to save {parent}',
                args: { parent: (context) => context.cardStateWhenInitiated.parent }
            },
            gameAction: GameActions.saveCard((context) => ({ event: context.event }))
        });
    }
}

BodyGuard.code = '01033';

export default BodyGuard;
