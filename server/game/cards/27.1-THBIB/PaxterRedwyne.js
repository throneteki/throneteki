import DrawCard from '../../drawcard.js';
import GameActions from '../../GameActions/index.js';

class PaxterRedwyne extends DrawCard {
    // Paxter Redwyne (27015)
    // Renown. Shadow (5).
    // Reaction: After you win a challenge in which Paxter Redwyne is participating, choose a
    // location you own and return it to your hand. (You may place it in shadows instead if it has
    // the Warship trait.) (Limit twice per phase.)
    setupCardAbilities(ability) {
        this.reaction({
            when: {
                afterChallenge: (event, context) =>
                    event.challenge.winner === context.source.controller &&
                    context.source.isParticipating()
            },
            target: {
                cardCondition: {
                    location: 'play area',
                    type: 'location',
                    controller: 'current'
                }
            },
            limit: ability.limit.perPhase(2),
            gameAction: GameActions.ifCondition({
                condition: (context) => !context.target.hasTrait('Warship'),
                thenAction: {
                    message: '{player} uses {source} and {gameAction}',
                    gameAction: GameActions.returnCardToHand((context) => ({
                        card: context.target
                    }))
                },
                elseAction: GameActions.choose({
                    title: 'Place location in shadows?',
                    message: '{player} uses {source} and {gameAction}',
                    choices: {
                        'Return to hand': GameActions.returnCardToHand((context) => ({
                            card: context.target
                        })),
                        'Put in shadows': GameActions.putIntoShadows((context) => ({
                            card: context.target
                        }))
                    }
                })
            })
        });
    }
}

PaxterRedwyne.code = '27015';

export default PaxterRedwyne;
