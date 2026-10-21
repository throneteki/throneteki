import GameActions from '../../GameActions/index.js';
import DrawCard from '../../drawcard.js';

class GreyWorm extends DrawCard {
    // Grey Worm (06053)
    // No attachments except Weapon.
    // Action: During a challenge in which Grey Worm is attacking, choose a defending character.
    // Until the end of the challenge, that character gets -3 STR. (Limit once per challenge.)
    setupCardAbilities(ability) {
        this.action({
            title: 'Give character -3 STR',
            condition: (context) => context.source.isAttacking(),
            target: {
                cardCondition: (card) =>
                    card.location === 'play area' &&
                    card.getType() === 'character' &&
                    card.isDefending()
            },
            limit: ability.limit.perChallenge(1),
            message:
                '{player} uses {source} to give {target} -3 STR until the end of the challenge',
            gameAction: GameActions.lastingEffect((context) => ({
                duration: 'untilEndOfChallenge',
                match: context.target,
                effect: ability.effects.modifyStrength(-3)
            }))
        });
    }
}

GreyWorm.code = '06053';

export default GreyWorm;
