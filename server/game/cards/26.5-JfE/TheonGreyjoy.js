import DrawCard from '../../drawcard.js';
import GameActions from '../../GameActions/index.js';

class TheonGreyjoy extends DrawCard {
    setupCardAbilities() {
        this.forcedInterrupt({
            when: {
                onCardLeftPlay: (event) => event.card === this
            },
            message: '{player} is forced by {source} to have each opponent gain 2 power',
            gameAction: GameActions.simultaneously((context) =>
                context.game.getOpponents(context.player).map((opponent) =>
                    GameActions.gainPower({
                        card: opponent.faction,
                        amount: 2
                    })
                )
            )
        });

        this.forcedReaction({
            when: {
                onIncomeCollected: () => true
            },
            target: {
                choosingPlayer: (player, context) => player === context.event.player,
                activePromptTitle: 'Select a character',
                cardCondition: (card, context) =>
                    card.controller == context.event.player && GameActions.kill({ card }).allow()
            },
            message: {
                format: '{choosingPlayer} is forced by {source} to kill {target}',
                args: { choosingPlayer: (context) => context.event.player }
            },
            handler: (context) => {
                this.game.resolveGameAction(
                    GameActions.kill((context) => ({ card: context.target })),
                    context
                );
            }
        });
    }
}

TheonGreyjoy.code = '26083';

export default TheonGreyjoy;
