import DrawCard from '../../drawcard.js';
import GameActions from '../../GameActions/index.js';

class StonyShoreThrall extends DrawCard {
    setupCardAbilities(ability) {
        this.reaction({
            when: {
                onCardEntersPlay: () => this.game.currentPhase === 'challenge'
            },
            limit: ability.limit.perRound(1),
            chooseOpponent: true,
            handler: (context) => {
                this.lastingEffect((ability) => ({
                    until: {
                        onCardEntersPlay: (event) =>
                            event.card.getType() === 'plot' &&
                            event.card.controller === context.opponent
                    },
                    match: (card) =>
                        card === card.controller.activePlot && card.controller === context.opponent,
                    targetController: context.opponent,
                    effect: ability.effects.modifyReserve(-1)
                }));
                this.lastingEffect((ability) => ({
                    until: {
                        onCardEntersPlay: (event) =>
                            event.card.getType() === 'plot' &&
                            event.card.controller === context.opponent
                    },
                    targetController: context.opponent,
                    effect: ability.effects.setMinReserve(2)
                }));
                this.game.resolveGameAction(
                    GameActions.may({
                        title: 'Have each player check reserve?',
                        message: {
                            format: '{player} forces each player to check reserve'
                        },
                        gameAction: GameActions.checkReserve()
                    }),
                    context
                );
            }
        });
    }
}

StonyShoreThrall.code = '00146';

export default StonyShoreThrall;
