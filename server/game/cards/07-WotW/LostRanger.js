import DrawCard from '../../drawcard.js';

class LostRanger extends DrawCard {
    setupCardAbilities() {
        this.forcedInterrupt({
            when: {
                onPhaseEnded: (event) => event.phase === 'challenge' && this.hasNoOtherRanger()
            },
            handler: () => {
                this.controller.sacrificeCard(this);
                this.game.addMessage(
                    '{0} is forced by {1} to sacrifice {1}',
                    this.controller,
                    this
                );
            }
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
