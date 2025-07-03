import DrawCard from '../../drawcard.js';
import GameActions from '../../GameActions/index.js';

class TheImpsAgent extends DrawCard {
    setupCardAbilities(ability) {
        this.reaction({
            when: {
                afterChallenge: (event) =>
                    event.challenge.winner === this.controller && this.isParticipating()
            },
            cost: ability.costs.putSelfIntoShadows(),
            message: {
                format: '{player} returns {source} to shadows to have {loser} choose a card in their hand and place it on the top or bottom of their deck',
                args: { loser: (context) => context.event.challenge.loser }
            },
            target: {
                choosingPlayer: (player, context) => player === context.event.challenge.loser,
                activePromptTitle: 'Select a card',
                cardCondition: { location: 'hand', controller: 'choosingPlayer' }
            },
            handler: (context) => {
                this.game.resolveGameAction(
                    GameActions.choose({
                        player: (context) => context.choosingPlayer,
                        title: `Place ${context.target.name} on top of bottom of deck?`,
                        choices: {
                            Top: {
                                message:
                                    '{player} places a card from their hand on top of their deck',
                                gameAction: GameActions.returnCardToDeck({
                                    card: context.target,
                                    bottom: false
                                })
                            },
                            Bottom: {
                                message:
                                    '{player} places a card from their hand on the bottom of their deck',
                                gameAction: GameActions.returnCardToDeck({
                                    card: context.target,
                                    bottom: true
                                })
                            }
                        }
                    }),
                    context
                );
            }
        });
    }
}

TheImpsAgent.code = '26025';

export default TheImpsAgent;
