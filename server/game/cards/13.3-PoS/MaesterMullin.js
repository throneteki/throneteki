import DrawCard from '../../drawcard.js';
import GameActions from '../../GameActions/index.js';

class MaesterMullin extends DrawCard {
    // Maester Mullin (13045)
    // Action: Kneel Maester Mullin to choose a character and a challenge type. Until the end of the
    // phase, that character cannot be declared as an attacker in challenges of that type.
    setupCardAbilities(ability) {
        this.action({
            title: 'Kneel to choose a character',
            cost: ability.costs.kneelSelf(),
            target: {
                cardCondition: (card) =>
                    card.location === 'play area' && card.getType() === 'character'
            },
            gameAction: GameActions.chooseChallengeType({
                message:
                    '{player} uses {source} to make {target} unable to be declared as an attacker in {challengeType} challenges this phase',
                gameAction: (challengeType) =>
                    GameActions.lastingEffect((context) => ({
                        duration: 'untilEndOfPhase',
                        condition: () => context.game.isDuringChallenge({ challengeType }),
                        match: context.target,
                        effect: ability.effects.cannotBeDeclaredAsAttacker()
                    }))
            })
        });
    }
}

MaesterMullin.code = '13045';

export default MaesterMullin;
