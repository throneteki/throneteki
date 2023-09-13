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
                            gameAction: GameActions.lookAtHand(context => ({ player: context.player, opponent: context.opponent, context })).then(this.thenAction())
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
                                    onSelect: () => true
                                });
                            }).then(this.thenAction())
                        }
                    }
                }), context);
            }
        });
    }

    // TODO: Add proper 'then' logic to ChooseGameAction (should simply attach the ThenAbilityAction to the chosen gameAction)
    thenAction() {
        return {
            message: {
                format: 'Then, {player} and {opponent} each draw 1 card',
                args: { opponent: context => context.parentContext.opponent }
            },
            gameAction: GameActions.simultaneously(context => 
                [context.player, context.parentContext.opponent].map(player => GameActions.drawCards({ player, amount: 1 }))
            )
        };
    }
}

AThousandEyesAndOne.code = '25609';
AThousandEyesAndOne.version = '1.0';

module.exports = AThousandEyesAndOne;
