import DrawCard from '../../drawcard.js';
import GameActions from '../../GameActions/index.js';

class ScalingTheWall extends DrawCard {
    // Scaling the Wall (07044)
    // Reaction: After you win a challenge in which you control an attacking Wildling character,
    // choose a non-limited location controlled by the losing opponent. Return that location to its
    // owner's hand.
    setupCardAbilities() {
        this.reaction({
            when: {
                afterChallenge: (event, context) =>
                    event.challenge.winner === context.source.controller &&
                    context.source.hasAttackingWildling()
            },
            target: {
                activePromptTitle: 'Select a location',
                cardCondition: (card, context) =>
                    card.location === 'play area' &&
                    card.getType() === 'location' &&
                    !card.isLimited() &&
                    card.controller === context.event.challenge.loser
            },
            message: {
                format: "{player} plays {source} to return {target} to {owner}'s hand",
                args: { owner: (context) => context.target.owner }
            },
            gameAction: GameActions.returnCardToHand((context) => ({ card: context.target }))
        });
    }

    hasAttackingWildling() {
        return this.controller.anyCardsInPlay(
            (card) =>
                card.isAttacking() && card.hasTrait('Wildling') && card.getType() === 'character'
        );
    }
}

ScalingTheWall.code = '07044';

export default ScalingTheWall;
