import DrawCard from '../../drawcard.js';
import GameActions from '../../GameActions/index.js';

class Harrenhal extends DrawCard {
    // Harrenhal (04082)
    // Reaction: After a character enters play, kneel your faction card and sacrifice Harrenhal to
    // kill it.
    setupCardAbilities(ability) {
        this.reaction({
            when: {
                onCardEntersPlay: (event, context) =>
                    event.card.getType() === 'character' &&
                    event.card.controller !== context.source.controller
            },
            cost: [ability.costs.sacrificeSelf(), ability.costs.kneelFactionCard()],
            message: {
                format: '{player} sacrifices {source} and kneels their faction card to kill {card}',
                args: { card: (context) => context.event.card }
            },
            gameAction: GameActions.kill((context) => ({ card: context.event.card }))
        });
    }
}

Harrenhal.code = '04082';

export default Harrenhal;
