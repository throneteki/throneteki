import DrawCard from '../../drawcard.js';
import GameActions from '../../GameActions/index.js';

class WhenAllIsDarkest extends DrawCard {
    // When All Is Darkest (26010)
    // Shadow (2).
    // Reaction: After a character comes out of shadows, kneel your faction card to take control of
    // that character.
    setupCardAbilities(ability) {
        this.reaction({
            when: {
                onCardOutOfShadows: (event, context) =>
                    event.card.getType() === 'character' &&
                    GameActions.takeControl({
                        player: context.source.controller,
                        card: event.card
                    }).allow()
            },
            cost: ability.costs.kneelFactionCard(),
            message: {
                format: '{player} plays {source} and kneels their faction card to take control of {card}',
                args: { card: (context) => context.event.card }
            },
            gameAction: GameActions.takeControl((context) => ({
                player: context.player,
                card: context.event.card
            }))
        });
    }
}

WhenAllIsDarkest.code = '26010';
export default WhenAllIsDarkest;
