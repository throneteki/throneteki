import DrawCard from '../../drawcard.js';

class HighgardenCourtier extends DrawCard {
    // Highgarden Courtier (09015)
    // Reaction: After another character’s STR is increased by a card effect, kneel Highgarden
    // Courtier to stand that character. (Limit once per phase.)
    setupCardAbilities(ability) {
        this.reaction({
            when: {
                onCardStrengthChanged: (event) =>
                    event.card !== this &&
                    event.card.controller === this.controller &&
                    event.amount > 0 &&
                    event.applying &&
                    event.card.kneeled
            },
            cost: ability.costs.kneelSelf(),
            limit: ability.limit.perPhase(1),
            handler: (context) => {
                this.game.addMessage(
                    '{0} kneels {1} to stand {2}',
                    this.controller,
                    this,
                    context.event.card
                );
                this.controller.standCard(context.event.card);
            }
        });
    }
}

HighgardenCourtier.code = '09015';

export default HighgardenCourtier;
