import DrawCard from '../../drawcard.js';
import GameActions from '../../GameActions/index.js';

class DornishSloop extends DrawCard {
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
