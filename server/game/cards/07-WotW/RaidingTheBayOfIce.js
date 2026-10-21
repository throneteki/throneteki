import DrawCard from '../../drawcard.js';
import GameActions from '../../GameActions/index.js';

class RaidingTheBayOfIce extends DrawCard {
    // Raiding the Bay of Ice (07028)
    // Reaction: After you win a challenge as the attacking player, kneel a Warship location to
    // choose a non-limited location controlled by the losing opponent, and place it on top of its
    // owner's deck.
    setupCardAbilities(ability) {
        this.reaction({
            when: {
                afterChallenge: (event, context) =>
                    event.challenge.winner === context.source.controller &&
                    event.challenge.attackingPlayer === context.source.controller
            },
            cost: ability.costs.kneel(
                (card) => card.hasTrait('Warship') && card.getType() === 'location'
            ),
            target: {
                activePromptTitle: 'Select a location',
                cardCondition: (card, context) =>
                    card.location === 'play area' &&
                    !card.isLimited() &&
                    card.getType() === 'location' &&
                    card.controller === context.game.currentChallenge.loser &&
                    GameActions.returnCardToDeck({ card }).allow()
            },
            message: "{player} plays {source} to place {target} on top of its owner's deck",
            gameAction: GameActions.returnCardToDeck((context) => ({
                card: context.target
            }))
        });
    }
}

RaidingTheBayOfIce.code = '07028';

export default RaidingTheBayOfIce;
