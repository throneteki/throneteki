import DrawCard from '../../drawcard.js';
import GameActions from '../../GameActions/index.js';

class TheNorthRemembers extends DrawCard {
    // The North Remembers (06042)
    // Challenges Action: Each player sacrifices a character or location.
    // Reaction: After a character you control is killed, pay 1 gold to return The North Remembers
    // from your discard pile to your hand.
    setupCardAbilities(ability) {
        this.action({
            title: 'Each player sacrifices a character or location',
            phase: 'challenge',
            target: {
                type: 'select',
                choosingPlayer: 'each',
                ifAble: true,
                activePromptTitle: 'Select a character or location',
                cardCondition: (card, context) =>
                    card.location === 'play area' &&
                    card.controller === context.choosingPlayer &&
                    (card.getType() === 'character' || card.getType() === 'location'),
                gameAction: 'sacrifice'
            },
            message: '{player} plays {source} to have each player sacrifice {target}',
            gameAction: GameActions.simultaneously((context) =>
                context.targets.selections
                    .filter((selection) => !!selection.value)
                    .map((selection) => GameActions.sacrificeCard({ card: selection.value }))
            )
        });
        this.reaction({
            location: 'discard pile',
            when: {
                onCharacterKilled: (event, context) =>
                    event.cardStateWhenKilled.controller === context.player
            },
            ignoreEventCosts: true,
            cost: ability.costs.payGold(1),
            message: '{player} pays 1 gold to return {source} to their hand',
            gameAction: GameActions.returnCardToHand((context) => ({ card: context.source }))
        });
    }
}

TheNorthRemembers.code = '06042';

export default TheNorthRemembers;
