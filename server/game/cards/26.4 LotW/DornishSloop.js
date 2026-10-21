import DrawCard from '../../drawcard.js';
import GameActions from '../../GameActions/index.js';

class DornishSloop extends DrawCard {
    // Dornish Sloop (26068)
    // Shadow (0).
    // Reaction: After Dornish Sloop comes out of shadows, choose a character with printed cost 5 or
    // lower. Until the end of the phase, that character loses a challenge icon of your choice.
    // +1 Reserve.
    setupCardAbilities(ability) {
        this.plotModifiers({
            reserve: 1
        });
        this.reaction({
            when: {
                onCardOutOfShadows: (event, context) => event.card === context.source
            },
            target: {
                cardCondition: {
                    location: 'play area',
                    type: 'character',
                    printedCostOrLower: 5,
                    condition: (card) => GameActions.loseIcon({ card }).allow()
                }
            },
            gameAction: GameActions.chooseIcon({
                message:
                    '{player} chooses to have {target} lose {icon} icon until the end of the phase',
                gameAction: (icon) =>
                    GameActions.lastingEffect((context) => ({
                        duration: 'untilEndOfPhase',
                        match: context.target,
                        effect: ability.effects.removeIcon(icon)
                    }))
            })
        });
    }
}

DornishSloop.code = '26068';

export default DornishSloop;
