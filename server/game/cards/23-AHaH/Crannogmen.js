import DrawCard from '../../drawcard.js';

class Crannogmen extends DrawCard {
    setupCardAbilities(ability) {
        this.interrupt({
            when: {
                onClaimApplied: (event) =>
                    event.challenge &&
                    event.challenge.isMatch({
                        winner: this.controller,
                        challengeType: 'intrigue'
                    }) &&
                    this.isAttacking()
            },
            target: {
                cardCondition: {
                    type: 'character',
                    location: 'play area',
                    printedCostOrLower: 3,
                    conditon: (card, context) => card.controller === context.event.challenge.loser
                },
                gameAction: 'kill'
            },
            cost: ability.costs.putSelfIntoShadows(),
            message:
                '{player} returns {source} to shadows to kill {target} instead of the normal claim effects',
            handler: (context) => {
                context.replaceHandler(() => {
                    this.game.killCharacter(context.target);
                });
            }
        });
    }
}

Crannogmen.code = '23011';

export default Crannogmen;
