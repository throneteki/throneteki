import DrawCard from '../../drawcard.js';
import GameActions from '../../GameActions/index.js';

class AlannysGreyjoy extends DrawCard {
    // Alannys Greyjoy (13031)
    // Reaction: After a [greyjoy] location enters play under your control, draw 1 card. (Limit once
    // per phase.)
    setupCardAbilities(ability) {
        this.reaction({
            when: {
                onCardEntersPlay: (event, context) =>
                    event.card.isFaction('greyjoy') &&
                    event.card.getType() === 'location' &&
                    event.card.controller === context.source.controller &&
                    context.source.controller.canDraw()
            },
            message: '{player} uses {source} to draw 1 card',
            gameAction: GameActions.drawCards((context) => ({ player: context.player, amount: 1 })),
            limit: ability.limit.perPhase(1)
        });
    }
}

AlannysGreyjoy.code = '13031';

export default AlannysGreyjoy;
