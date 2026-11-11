import GameActions from '../../GameActions/index.js';
import DrawCard from '../../drawcard.js';

class PurpleGraces extends DrawCard {
    // Purple Graces (27033)
    // Action: During a [military] challenge, kneel Purple Graces to choose an attacking character.
    // Until the end of the phase, that character gets -2 STR.
    setupCardAbilities(ability) {
        this.action({
            title: 'Give an attacker -2 STR',
            phase: 'challenge',
            condition: (context) => context.game.isDuringChallenge({ challengeType: 'military' }),
            cost: ability.costs.kneelSelf(),
            target: {
                cardCondition: (card) =>
                    card.location === 'play area' &&
                    card.getType() === 'character' &&
                    card.isAttacking()
            },
            message: '{player} kneels {source} to give {target} -2 STR until the end of the phase',
            gameAction: GameActions.lastingEffect((context) => ({
                duration: 'untilEndOfPhase',
                match: context.target,
                effect: ability.effects.modifyStrength(-2)
            }))
        });
    }
}

PurpleGraces.code = '27033';

export default PurpleGraces;
