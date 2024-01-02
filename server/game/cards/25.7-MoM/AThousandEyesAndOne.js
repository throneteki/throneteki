const GameActions = require('../../GameActions/index.js');
const DrawCard = require('../../drawcard.js');

class AThousandEyesAndOne extends DrawCard {
    setupCardAbilities(ability) {
        this.action({
            title: 'Look at an opponent hand or shadows',
            cost: ability.costs.kneelFactionCard(),
            chooseOpponent: true,
            handler: context => {
                this.game.resolveGameAction(GameActions.choose({
                    title: context => `Look at ${context.opponent.name}'s hand or shadows area?`,
                    choices: {
                        'Hand': {
                            message: '{player} chooses to look at {opponent}\'s hand',
                            gameAction: GameActions.lookAtHand(context => ({ player: context.player, opponent: context.opponent, context })).then(context => this.drawCard(context))
                        },
                        'Shadows area': {
                            message: '{player} chooses to look at {opponent}\'s shadows area',
                            gameAction: GameActions.genericHandler(context => {
                                // TODO: Create actual GameAction for looking at shadows (maybe looking at specific locations, and update LookAtHand as well?)
                                context.game.promptForSelect(context.player, {
                                    activePromptTitle: `Look at ${context.opponent.name}'s shadows area`,
                                    source: context.source,
                                    revealTargets: true,
                                    cardCondition: card => card.location === 'shadows' && card.controller === context.opponent,
                                    onSelect: () => this.drawCard(context),
                                    onCancel: () => this.drawCard(context)
                                });
                            })
                        }
                    }
                }), context);
            }
        });
    }

    drawCard(context) {
        this.game.addMessage('Then, {0} draws 1 card', context.player);
        this.game.resolveGameAction(
            GameActions.drawCards({ player: context.player, amount: 1 }),
            context
        );
    }
}

AThousandEyesAndOne.code = '25609';
AThousandEyesAndOne.version = '1.1';

module.exports = AThousandEyesAndOne;
