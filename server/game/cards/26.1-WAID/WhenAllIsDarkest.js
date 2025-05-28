import DrawCard from '../../drawcard.js';
import GameActions from '../../GameActions/index.js';

class WhenAllIsDarkest extends DrawCard {
    setupCardAbilities(ability) {
        this.reaction({
            when: {
                onCardOutOfShadows: (event) =>
                    event.card.getType() === 'character' &&
                    GameActions.takeControl({
                        player: this.controller,
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
