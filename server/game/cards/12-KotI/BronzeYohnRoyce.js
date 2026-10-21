import DrawCard from '../../drawcard.js';

class BronzeYohnRoyce extends DrawCard {
    // Bronze Yohn Royce (12039)
    // Renown.
    // Reaction: After you win a challenge in which Bronze Yohn Royce is defending, kneel a neutral
    // location with printed cost 1 or higher to stand him. (Limit twice per phase.)
    setupCardAbilities(ability) {
        this.reaction({
            when: {
                afterChallenge: (event) =>
                    event.challenge.winner === this.controller && this.isDefending() && this.kneeled
            },
            cost: ability.costs.kneel(
                (card) =>
                    card.getType() === 'location' &&
                    card.isFaction('neutral') &&
                    card.getPrintedCost() >= 1
            ),
            handler: (context) => {
                this.game.addMessage(
                    '{0} uses {1} and kneels {2} to stand {1}',
                    context.player,
                    this,
                    context.costs.kneel
                );
                this.controller.standCard(this);
            }
        });
    }
}

BronzeYohnRoyce.code = '12039';

export default BronzeYohnRoyce;
