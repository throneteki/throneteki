import DrawCard from '../../drawcard.js';

class BlackwaterForces extends DrawCard {
    setupCardAbilities(ability) {
        this.reaction({
            when: {
                onCardStood: (event) => event.card === this && this.game.isDuringChallenge()
            },
            target: {
                cardCondition: { location: 'play area', type: 'character', participating: true }
            },
            limit: ability.limit.perPhase(3),
            message:
                '{player} uses {source} to give {target} +2 STR until the end of the challenge',
            handler: (context) => {
                this.untilEndOfChallenge((ability) => ({
                    match: context.target,
                    effect: ability.effects.modifyStrength(2)
                }));
            }
        });
    }
}

BlackwaterForces.code = '25115';

export default BlackwaterForces;
