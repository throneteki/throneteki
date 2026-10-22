import DrawCard from '../../drawcard.js';
import GameActions from '../../GameActions/index.js';

class TheImpsAgent extends DrawCard {
    // The Imp's Agent (26025)
    // Shadow (3).
    // Reaction: After you win a challenge in which The Imp's Agent is participating, return it to
    // shadows to have the losing opponent choose a card in their hand and place it on the top or
    // bottom of their deck.
    setupCardAbilities(ability) {
        this.reaction({
            when: {
                afterChallenge: (event, context) =>
                    event.challenge.winner === context.player &&
                    event.challenge.isParticipating(context.source)
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
            gameAction: GameActions.choose({
                player: (context) => context.event.challenge.loser,
                title: (context) => `Place ${context.target.name} on top or bottom of deck?`,
                choices: {
                    Top: {
                        message:
                            '{choosingPlayer} places a card from their hand on top of their deck',
                        gameAction: GameActions.returnCardToDeck((context) => ({
                            card: context.target,
                            bottom: false
                        }))
                    },
                    Bottom: {
                        message:
                            '{choosingPlayer} places a card from their hand on the bottom of their deck',
                        gameAction: GameActions.returnCardToDeck((context) => ({
                            card: context.target,
                            bottom: true
                        }))
                    }
                }
            })
        });
    }
}

TheImpsAgent.code = '26025';

export default TheImpsAgent;
