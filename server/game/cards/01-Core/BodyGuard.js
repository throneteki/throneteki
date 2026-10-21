import DrawCard from '../../drawcard.js';

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
                onCharacterKilled: (event) =>
                    event.card === this.parent && this.parent.canBeSaved() && event.allowSave,
                onCardDiscarded: (event) =>
                    event.card === this.parent && this.parent.canBeSaved() && event.allowSave
            },
            cost: ability.costs.sacrificeSelf(),
            handler: (context) => {
                let parent = context.cardStateWhenInitiated.parent;
                context.event.saveCard();
                this.game.addMessage(
                    '{0} sacrifices {1} to save {2}',
                    this.controller,
                    this,
                    parent
                );
            }
        });
    }
}

BodyGuard.code = '01033';

export default BodyGuard;
