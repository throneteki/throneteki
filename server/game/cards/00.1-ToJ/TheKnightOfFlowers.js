import DrawCard from '../../drawcard.js';
import GameActions from '../../GameActions/index.js';

class TheKnightOfFlowers extends DrawCard {
    setupCardAbilities(ability) {
        this.reaction({
            when: {
                onChallengeInitiated: (event) =>
                    event.challenge.attackingPlayer === this.controller &&
                    this.controller.anyCardsInPlay(
                        (card) =>
                            this.game.isDuringChallenge({ attackingAlone: card }) &&
                            card.hasTrait('Knight')
                    )
            },
            limit: ability.limit.perRound(1),
            handler: (context) => {
                let participatingCard = this.controller.filterCardsInPlay((card) => {
                    return (
                        card.isParticipating() &&
                        card.hasTrait('Knight') &&
                        card.getType() === 'character'
                    );
                });
                this.game.resolveGameAction(
                    GameActions.standCard(() => ({ card: participatingCard[0] })),
                    context
                );
                this.game.addMessage(
                    '{0} uses {1} to stand {2}',
                    context.player,
                    this,
                    participatingCard[0]
                );
            }
        });
    }
}

TheKnightOfFlowers.code = '00273';

export default TheKnightOfFlowers;
