import DrawCard from '../../drawcard.js';
import { ChallengeTracker } from '../../EventTrackers/index.js';
import GameActions from '../../GameActions/index.js';

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
                onChallengeInitiated: (event, context) =>
                    event.challenge.initiatedAgainstPlayer === context.source.controller &&
                    context.source.tracker.some({
                        loser: context.source.controller,
                        defendingPlayer: context.source.controller
                    })
            },
            cost: ability.costs.returnToHand(
                (card) => card.isFaction('martell') && card.getType() === 'character'
            ),
            target: {
                cardCondition: (card, context) =>
                    card.location === 'hand' &&
                    card.controller === context.source.controller &&
                    card.isFaction('martell') &&
                    card.getType() === 'character' &&
                    card.getPrintedCost() <= 5 &&
                    (!context.costs.returnToHand || card !== context.costs.returnToHand)
            },
            message:
                '{player} plays {source} and returns {costs.returnToHand} to their hand to put {target} into play',
            gameAction: GameActions.putIntoPlay((context) => ({
                player: context.player,
                card: context.target
            }))
        });
    }
}

ServeObeyProtect.code = '11036';

export default ServeObeyProtect;
