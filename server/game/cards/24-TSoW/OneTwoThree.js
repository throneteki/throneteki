import DrawCard from '../../drawcard.js';
import GameActions from '../../GameActions/index.js';

class OneTwoThree extends DrawCard {
    // One, Two, Three (24009)
    // Reaction: After you win an [intrigue] challenge, choose a participating character you control
    // and (choose one):
    // - return it to its owner's hand.
    // - place it in shadows.
    // - have it gain insight until the end of the phase.
    setupCardAbilities(ability) {
        this.reaction({
            when: {
                afterChallenge: (event, context) =>
                    event.challenge.isMatch({
                        winner: context.source.controller,
                        challengeType: 'intrigue'
                    })
            },
            target: {
                cardCondition: {
                    location: 'play area',
                    type: 'character',
                    participating: true,
                    controller: 'current'
                }
            },
            choices: {
                'Return to hand': {
                    message: "{player} plays {source} to return {target} to it's owners hand",
                    gameAction: GameActions.returnCardToHand((context) => ({
                        card: context.target
                    }))
                },
                'Place in shadows': {
                    message: '{player} plays {source} to place {target} in shadows',
                    gameAction: GameActions.putIntoShadows((context) => ({ card: context.target }))
                },
                'Gain insight': {
                    message:
                        '{player} plays {source} to have {target} gain insight until the end of the phase',
                    gameAction: GameActions.lastingEffect((context) => ({
                        duration: 'untilEndOfPhase',
                        match: context.target,
                        effect: ability.effects.addKeyword('insight')
                    }))
                }
            }
        });
    }
}

OneTwoThree.code = '24009';

export default OneTwoThree;
