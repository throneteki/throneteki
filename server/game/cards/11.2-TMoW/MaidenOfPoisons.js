import DrawCard from '../../drawcard.js';
import GameActions from '../../GameActions/index.js';

class MaidenOfPoisons extends DrawCard {
    // Maiden of Poisons (11035)
    // Shadow (2).
    // Reaction: After you lose a challenge in which Maiden of Poisons is participating, sacrifice
    // it to choose a participating character with fewer than 2 challenge icons and return it to its
    // owner’s hand.
    setupCardAbilities(ability) {
        this.reaction({
            when: {
                afterChallenge: (event, context) =>
                    event.challenge.loser === context.source.controller &&
                    context.source.isParticipating()
            },
            cost: ability.costs.sacrificeSelf(),
            target: {
                cardCondition: (card) =>
                    card.location === 'play area' &&
                    card.getType() === 'character' &&
                    card.isParticipating() &&
                    card.getNumberOfIcons() < 2
            },
            message: {
                format: "{player} sacrifices {source} to return {target} to {owner}'s hand",
                args: { owner: (context) => context.target.owner }
            },
            gameAction: GameActions.returnCardToHand((context) => ({ card: context.target }))
        });
    }
}

MaidenOfPoisons.code = '11035';

export default MaidenOfPoisons;
