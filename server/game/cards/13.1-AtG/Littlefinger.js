import DrawCard from '../../drawcard.js';
import TextHelper from '../../TextHelper.js';
import GameActions from '../../GameActions/index.js';

class Littlefinger extends DrawCard {
    // Littlefinger (13017)
    // Shadow (6). Stealth.
    // Reaction: After a character you control comes out of shadows, place up to 3 cards from your
    // hand on the bottom of your deck in any order. Then, draw that many cards. (Limit once per
    // round.)
    setupCardAbilities(ability) {
        this.reaction({
            when: {
                onCardOutOfShadows: (event, context) =>
                    event.card.controller === context.player && event.card.getType() === 'character'
            },
            limit: ability.limit.perRound(1),
            target: {
                type: 'select',
                mode: 'upTo',
                numCards: 3,
                activePromptTitle: 'Select up to 3 cards',
                cardCondition: (card, context) =>
                    card.controller === context.player && card.location === 'hand'
            },
            message: {
                format: '{player} uses {source} to place {amount} on the bottom of their deck and draw that many',
                args: { amount: (context) => TextHelper.count(context.target.length, 'card') }
            },
            gameAction: GameActions.simultaneously([
                GameActions.simultaneously((context) =>
                    context.target.map((card) =>
                        GameActions.placeCard({ card, location: 'draw deck', bottom: true })
                    )
                ),
                GameActions.drawCards((context) => ({
                    player: context.player,
                    amount: context.target.length
                }))
            ])
        });
    }
}

Littlefinger.code = '13017';

export default Littlefinger;
