import DrawCard from '../../drawcard.js';
import GameActions from '../../GameActions/index.js';

class LostRanger extends DrawCard {
    // Lost Ranger (07014)
    // No attachments except Weapon.
    // Forced Interrupt: When the challenges phase ends, if you control no other Ranger characters,
    // sacrifice Lost Ranger.
    setupCardAbilities() {
        this.forcedInterrupt({
            when: {
                onPhaseEnded: (event, context) =>
                    event.phase === 'challenge' && context.source.hasNoOtherRanger()
            },
            message: '{player} is forced by {source} to sacrifice {source}',
            gameAction: GameActions.sacrificeCard((context) => ({ card: context.source }))
        });
    }

    hasNoOtherRanger() {
        let rangers = this.controller.filterCardsInPlay((card) => {
            return card !== this && card.hasTrait('Ranger') && card.getType() === 'character';
        });

        return rangers.length === 0;
    }
}

LostRanger.code = '07014';

export default LostRanger;
