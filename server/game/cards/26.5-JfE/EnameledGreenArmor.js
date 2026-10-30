import GameActions from '../../GameActions/index.js';
import DrawCard from '../../drawcard.js';

class EnameledGreenArmor extends DrawCard {
    // Enameled Green Armor (26096)
    // Character you control only.
    // Attached character gains renown.
    // Challenges Action: During a challenge in which attached character is participating, kneel
    // Enameled Green Armor to choose a participating character. That character contributes its STR
    // to your side this challenge.
    setupCardAbilities(ability) {
        this.attachmentRestriction({ controller: 'current' });
        this.whileAttached({
            effect: ability.effects.addKeyword('renown')
        });

        this.action({
            title: 'Choose participating character',
            condition: (context) => context.source.parent.isParticipating(),
            cost: ability.costs.kneelSelf(),
            target: {
                cardCondition: {
                    type: 'character',
                    participating: true
                }
            },
            message: '{player} kneels {source} to have {target} contribute STR to their side',
            gameAction: GameActions.lastingEffect((context) => ({
                duration: 'untilEndOfChallenge',
                targetController: 'current',
                effect: ability.effects.contributeCharacterStrength(context.target)
            }))
        });
    }
}

EnameledGreenArmor.code = '26096';

export default EnameledGreenArmor;
