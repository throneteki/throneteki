import DrawCard from '../../drawcard.js';
import GameActions from '../../GameActions/index.js';

class Kingsgrave extends DrawCard {
    // Kingsgrave (14030)
    // Reaction: After you lose a [power] challenge by 5 or more STR, kneel and sacrifice Kingsgrave
    // to choose a participating character and return it to its owner's hand. (You may kill that
    // character instead if it has the King trait.)
    setupCardAbilities(ability) {
        this.reaction({
            when: {
                afterChallenge: (event, context) =>
                    event.challenge.isMatch({
                        loser: context.player,
                        challengeType: 'power',
                        by5: true
                    })
            },
            cost: [ability.costs.kneelSelf(), ability.costs.sacrificeSelf()],
            target: {
                cardCondition: (card) => card.getType() === 'character' && card.isParticipating(),
                gameAction: 'returnToHand'
            },
            gameAction: GameActions.ifCondition({
                condition: (context) =>
                    context.target.hasTrait('King') && context.target.canBeKilled(),
                thenAction: GameActions.choose({
                    title: (context) => `Kill ${context.target.name}?`,
                    choices: {
                        Yes: {
                            message: '{player} kneels and sacrifices {source} to kill {target}',
                            gameAction: GameActions.kill((context) => ({ card: context.target }))
                        },
                        No: returnToHand()
                    }
                }),
                elseAction: returnToHand()
            })
        });
    }
}

function returnToHand() {
    return {
        message: '{player} kneels and sacrifices {source} to return {target} to hand',
        gameAction: GameActions.returnCardToHand((context) => ({ card: context.target }))
    };
}

Kingsgrave.code = '14030';

export default Kingsgrave;
