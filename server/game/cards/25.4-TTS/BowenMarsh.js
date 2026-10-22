import DrawCard from '../../drawcard.js';
import GameActions from '../../GameActions/index.js';

class BowenMarsh extends DrawCard {
    // Bowen Marsh (25069)
    // Insight. Shadow (4).
    // Reaction: After a card you control comes out of shadows, choose a character and a challenge
    // type. Until the end of the phase, that character cannot be declared as an attacker in
    // challenges of that type. (Limit 3 times per phase.)
    setupCardAbilities(ability) {
        this.reaction({
            when: {
                onCardOutOfShadows: (event, context) => event.card.controller === context.player
            },
            limit: ability.limit.perPhase(3),
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

BowenMarsh.code = '25069';

export default BowenMarsh;
