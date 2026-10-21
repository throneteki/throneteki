import DrawCard from '../../drawcard.js';

class RandyllTarly extends DrawCard {
    // Randyll Tarly (01183)
    // Renown.
    // Reaction: After Randyll Tarly's STR is increased by a card effect, stand him. (Limit twice
    // per phase.)
    setupCardAbilities(ability) {
        this.reaction({
            when: {
                onCardStrengthChanged: (event) =>
                    event.card === this && event.amount > 0 && event.applying && this.kneeled
            },
            limit: ability.limit.perPhase(2),
            handler: () => {
                this.game.addMessage(
                    '{0} stands {1} due to strength increase',
                    this.controller,
                    this
                );
                this.controller.standCard(this);
            }
        });
    }
}

RandyllTarly.code = '01183';

export default RandyllTarly;
