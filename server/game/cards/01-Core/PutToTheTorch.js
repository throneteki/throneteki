import DrawCard from '../../drawcard.js';

class PutToTheTorch extends DrawCard {
    // Put to the Torch (01042)
    // Reaction: After you win a [military] challenge by 5 or more STR as the attacking player,
    // choose a location controlled by the losing opponent, and discard it from play. (Max 1 per
    // challenge.)
    setupCardAbilities(ability) {
        this.reaction({
            max: ability.limit.perChallenge(1),
            when: {
                afterChallenge: (event) =>
                    event.challenge.challengeType === 'military' &&
                    event.challenge.winner === this.controller &&
                    event.challenge.attackingPlayer === this.controller &&
                    event.challenge.strengthDifference >= 5
            },
            target: {
                activePromptTitle: 'Select a location',
                cardCondition: (card) =>
                    card.location === 'play area' &&
                    card.controller === this.game.currentChallenge.loser &&
                    card.getType() === 'location',
                gameAction: 'discard'
            },
            handler: (context) => {
                context.target.controller.discardCard(context.target);
                this.game.addMessage(
                    '{0} plays {1} to discard {2}',
                    context.player,
                    this,
                    context.target
                );
            }
        });
    }
}

PutToTheTorch.code = '01042';

export default PutToTheTorch;
