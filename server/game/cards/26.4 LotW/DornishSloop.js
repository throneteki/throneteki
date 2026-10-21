import DrawCard from '../../drawcard.js';
import GameActions from '../../GameActions/index.js';

class DornishSloop extends DrawCard {
    // Dornish Sloop (26068)
    // Shadow (0).
    // Reaction: After Dornish Sloop comes out of shadows, choose a character with printed cost 5 or
    // lower. Until the end of the phase, that character loses a challenge icon of your choice.
    // +1 Reserve.
    setupCardAbilities() {
        this.plotModifiers({
            reserve: 1
        });
        this.reaction({
            when: {
                onCardOutOfShadows: (event) => event.card === this
            },
            target: {
                cardCondition: {
                    location: 'play area',
                    type: 'character',
                    printedCostOrLower: 5,
                    condition: (card) => GameActions.loseIcon({ card }).allow()
                }
            },
            handler: (context) => {
                this.game.promptForIcon(this.controller, this, (icon) => {
                    this.untilEndOfPhase((ability) => ({
                        match: context.target,
                        effect: ability.effects.removeIcon(icon)
                    }));

                    this.game.addMessage(
                        '{0} chooses to have {1} lose {2} {3} icon until the end of the phase',
                        this.controller,
                        context.target,
                        icon === 'intrigue' ? 'an' : 'a',
                        icon
                    );
                });
            }
        });
    }
}

DornishSloop.code = '26068';

export default DornishSloop;
