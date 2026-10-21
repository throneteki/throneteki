import DrawCard from '../../drawcard.js';
import GameActions from '../../GameActions/index.js';

class SkyCell extends DrawCard {
    // Sky Cell (16022)
    // Terminal.
    // Forced Interrupt: When attached character's controller would draw 1 or more cards, kneel
    // attached character. Then, that player draws 1 less card instead.
    // Attached character gains "Action: Kill this character (cannot be saved)."
    setupCardAbilities(ability) {
        this.forcedInterrupt({
            when: {
                onCardsDrawn: (event) =>
                    this.parent && event.player === this.parent.controller && event.amount > 0
            },
            message: {
                format: '{player} uses {source} to kneel {parent}',
                args: { parent: () => this.parent }
            },
            gameAction: GameActions.kneelCard(() => ({
                card: this.parent
            })).then({
                message: {
                    format: 'Then {parentController} draws 1 less card',
                    args: { parentController: () => this.parent.controller }
                },
                handler: (thenContext) => {
                    thenContext.parentContext.event.amount -= 1;
                }
            })
        });

        // TODO: gain text "Kill character"
        this.whileAttached({
            effect: ability.effects.gainText((text) => {
                text.action({
                    title: 'Kill character',
                    message: '{player} kills {source}',
                    handler: () => {
                        this.game.killCharacter(this.parent, { allowSave: false });
                    }
                });
            })
        });
    }
}

SkyCell.code = '16022';

export default SkyCell;
