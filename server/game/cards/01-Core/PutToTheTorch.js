import DrawCard from '../../drawcard.js';
import GameActions from '../../GameActions/index.js';

class PutToTheTorch extends DrawCard {
    // Put to the Torch (01042)
    // Reaction: After you win a [military] challenge by 5 or more STR as the attacking player,
    // choose a location controlled by the losing opponent, and discard it from play. (Max 1 per
    // challenge.)
    setupCardAbilities(ability) {
        this.reaction({
            max: ability.limit.perChallenge(1),
            when: {
                afterChallenge: (event, context) =>
                    event.challenge.challengeType === 'military' &&
                    event.challenge.winner === context.source.controller &&
                    event.challenge.attackingPlayer === context.source.controller &&
                    event.challenge.strengthDifference >= 5
            },
            target: {
                activePromptTitle: 'Select a location',
                cardCondition: (card, context) =>
                    card.location === 'play area' &&
                    card.controller === context.game.currentChallenge.loser &&
                    card.getType() === 'location',
                gameAction: 'discard'
            },
            message: '{player} plays {source} to discard {target}',
            gameAction: GameActions.discardCard((context) => ({ card: context.target }))
        });
    }
}

PutToTheTorch.code = '01042';

export default PutToTheTorch;
