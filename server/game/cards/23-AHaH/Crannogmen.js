import DrawCard from '../../drawcard.js';

class Crannogmen extends DrawCard {
    // Crannogmen (23011)
    // Shadow (3).
    // Interrupt: When claim is applied for an [intrigue] challenge in which Crannogmen is
    // attacking, return it to shadows to choose a character with printed cost 3 or lower controlled
    // by the losing opponent. Instead of the normal claim effects, kill that character.
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
