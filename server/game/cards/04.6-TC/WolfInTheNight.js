import GameActions from '../../GameActions/index.js';
import DrawCard from '../../drawcard.js';

class WolfInTheNight extends DrawCard {
    // "Wolf in the Night" (04102)
    // Action: Choose a [stark] character that is attacking alone. Until the end of the challenge,
    // that character gets +3 STR and gains renown.
    setupCardAbilities(ability) {
        this.action({
            title: 'Give +3 STR and renown to character',
            target: {
                cardCondition: (card, context) =>
                    card.location === 'play area' &&
                    card.getType() === 'character' &&
                    card.isFaction('stark') &&
                    context.game.isDuringChallenge({ attackingAlone: card })
            },
            message:
                '{player} uses {source} to give {target} +3 STR and renown until the end of the challenge',
            gameAction: GameActions.lastingEffect((context) => ({
                duration: 'untilEndOfChallenge',
                match: context.target,
                effect: [ability.effects.modifyStrength(3), ability.effects.addKeyword('Renown')]
            }))
        });
    }
}

WolfInTheNight.code = '04102';

export default WolfInTheNight;
