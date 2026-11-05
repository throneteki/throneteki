import DrawCard from '../../drawcard.js';
import GameActions from '../../GameActions/index.js';

class TheMander extends DrawCard {
    // The Mander (01193)
    // Reaction: After you win a challenge by 5 or more STR, kneel The Mander to draw 2 cards.
    setupCardAbilities(ability) {
        this.reaction({
            when: {
                afterChallenge: (event, context) =>
                    event.challenge.winner === context.source.controller &&
                    event.challenge.strengthDifference >= 5 &&
                    context.source.controller.canDraw()
            },
            cost: ability.costs.kneelSelf(),
            message: '{player} kneels {source} to draw 2 cards',
            gameAction: GameActions.drawCards((context) => ({ player: context.player, amount: 2 }))
        });
    }
}

TheMander.code = '01193';

export default TheMander;
