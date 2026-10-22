import DrawCard from '../../drawcard.js';
import GameActions from '../../GameActions/index.js';

class WolvesInTheHills extends DrawCard {
    // "Wolves in the Hills" (26112)
    // Interrupt: When claim is applied for a challenge, return an attacking Direwolf character or
    // an attacking character with a Direwolf attachment to your hand to apply claim of another
    // challenge type instead.
    setupCardAbilities(ability) {
        this.interrupt({
            when: {
                onClaimApplied: () => true
            },
            cost: ability.costs.returnToHand(
                (card) =>
                    card.getType() === 'character' &&
                    card.isAttacking() &&
                    (card.hasTrait('Direwolf') ||
                        card.attachments.some((attachment) => attachment.hasTrait('Direwolf')))
            ),
            message:
                '{player} plays {source} and returns {costs.returnToHand} to their hand to change the apply claim of a different challenge type instead',
            gameAction: GameActions.chooseChallengeType({
                title: 'Name a challenge type',
                exclude: (context) => context.event.claim.challengeType,
                message: '{player} applies {challengeType} claim instead',
                gameAction: (challengeType) =>
                    GameActions.changeClaimType((context) => ({
                        event: context.event,
                        challengeType
                    }))
            })
        });
    }
}

WolvesInTheHills.code = '26112';

export default WolvesInTheHills;
