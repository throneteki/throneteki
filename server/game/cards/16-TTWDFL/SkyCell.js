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
                onCardsDrawn: (event, context) =>
                    !!context.source.parent &&
                    event.player === context.source.parent.controller &&
                    event.amount > 0
            },
            message: {
                format: '{player} uses {source} to kneel {parent}',
                args: { parent: (context) => context.source.parent }
            },
            gameAction: GameActions.kneelCard((context) => ({
                card: context.source.parent
            })).then({
                message: {
                    format: 'Then {parentController} draws 1 less card',
                    args: { parentController: (context) => context.source.parent.controller }
                },
                gameAction: GameActions.changeEventAmount((context) => ({
                    event: context.parentContext.event,
                    amount: context.parentContext.event.amount - 1
                }))
            })
        });

        this.whileAttached({
            effect: ability.effects.gainText((text) => {
                text.action({
                    title: 'Kill character',
                    message: '{player} kills {source}',
                    gameAction: GameActions.kill((context) => ({
                        card: context.source,
                        allowSave: false
                    }))
                });
            })
        });
    }
}

SkyCell.code = '16022';

export default SkyCell;
