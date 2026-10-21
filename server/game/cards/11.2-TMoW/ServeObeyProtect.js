import DrawCard from '../../drawcard.js';
import { ChallengeTracker } from '../../EventTrackers/index.js';

class ServeObeyProtect extends DrawCard {
    // Serve. Obey. Protect. (11036)
    // Play only if you have lost a challenge as the defending player this phase.
    // Reaction: After an opponent initiates a challenge against you, return a [martell] character
    // to your hand to put a different [martell] character with printed cost 5 or lower into play
    // from your hand.
    setupCardAbilities(ability) {
        this.tracker = ChallengeTracker.forPhase(this.game);

        this.reaction({
            when: {
                onChallengeInitiated: (event) =>
                    event.challenge.initiatedAgainstPlayer === this.controller &&
                    this.tracker.some({ loser: this.controller, defendingPlayer: this.controller })
            },
            cost: ability.costs.returnToHand(
                (card) => card.isFaction('martell') && card.getType() === 'character'
            ),
            target: {
                cardCondition: (card, context) =>
                    card.location === 'hand' &&
                    card.controller === this.controller &&
                    card.isFaction('martell') &&
                    card.getType() === 'character' &&
                    card.getPrintedCost() <= 5 &&
                    (!context.costs.returnToHand || card !== context.costs.returnToHand)
            },
            handler: (context) => {
                context.player.putIntoPlay(context.target);
                this.game.addMessage(
                    '{0} plays {1} and returns {2} to their hand to put {3} into play',
                    context.player,
                    this,
                    context.costs.returnToHand,
                    context.target
                );
            }
        });
    }
}

ServeObeyProtect.code = '11036';

export default ServeObeyProtect;
