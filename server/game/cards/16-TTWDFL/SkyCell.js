const DrawCard = require('../../drawcard');
const GameActions = require('../../GameActions');

class SkyCell extends DrawCard {
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

module.exports = SkyCell;
