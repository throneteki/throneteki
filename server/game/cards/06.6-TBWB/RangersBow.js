import GameActions from '../../GameActions/index.js';
import DrawCard from '../../drawcard.js';

class RangersBow extends DrawCard {
    // Ranger's Bow (06106)
    // [thenightswatch] character only.
    // Attached character gets +1 STR.
    // Challenges Action: Kneel Ranger's Bow to choose a defending [thenightswatch] character. Until
    // the end of the challenge, that character gets +2 STR.
    setupCardAbilities(ability) {
        this.attachmentRestriction({ faction: 'thenightswatch' });

        this.whileAttached({
            effect: ability.effects.modifyStrength(1)
        });

        this.action({
            title: 'Give defending character +2 STR',
            cost: ability.costs.kneelSelf(),
            target: {
                cardCondition: (card) =>
                    card.isFaction('thenightswatch') &&
                    card.getType() === 'character' &&
                    card.isDefending()
            },
            message:
                '{player} kneels {source} to give {target} +2 STR until the end of the challenge',
            gameAction: GameActions.lastingEffect((context) => ({
                duration: 'untilEndOfChallenge',
                match: context.target,
                effect: ability.effects.modifyStrength(2)
            }))
        });
    }
}

RangersBow.code = '06106';

export default RangersBow;
