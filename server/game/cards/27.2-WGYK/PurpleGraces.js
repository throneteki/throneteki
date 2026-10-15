import DrawCard from '../../drawcard.js';

class PurpleGraces extends DrawCard {
    setupCardAbilities(ability) {
        this.action({
            title: 'Give an attacker -2 STR',
            phase: 'challenge',
            condition: () => this.game.isDuringChallenge({ challengeType: 'military' }),
            cost: ability.costs.kneelSelf(),
            target: {
                cardCondition: (card) =>
                    card.location === 'play area' &&
                    card.getType() === 'character' &&
                    card.isAttacking()
            },
            message: '{player} kneels {source} to give {target} -2 STR until the end of the phase',
            handler: (context) => {
                this.untilEndOfPhase((ability) => ({
                    match: context.target,
                    effect: ability.effects.modifyStrength(-2)
                }));
            }
        });
    }
}

PurpleGraces.code = '27033';

export default PurpleGraces;
