import DrawCard from '../../drawcard.js';
import GameActions from '../../GameActions/index.js';

class GhostHillElite extends DrawCard {
    // Ghost Hill Elite (26027)
    // Ambush (6). No attachments.
    // Reaction: After Ghost Hill Elite enters play, choose a character. Until the end of the phase,
    // that character loses an [intrigue] or [power] icon and Ghost Hill Elite gains that icon.
    // Then, if that character has no challenge icons, kill it.
    setupCardAbilities(ability) {
        this.reaction({
            when: {
                onCardEntersPlay: (event, context) => event.card === context.source
            },
            target: {
                cardCondition: {
                    location: 'play area',
                    type: 'character'
                }
            },
            gameAction: GameActions.chooseIcon({
                icons: ['intrigue', 'power'],
                message:
                    '{player} uses {source} to have {target} lose {icon} icon and have {source} gain {icon} icon until the end of the phase',
                gameAction: (icon) =>
                    GameActions.simultaneously([
                        GameActions.lastingEffect((context) => ({
                            duration: 'untilEndOfPhase',
                            match: context.target,
                            effect: ability.effects.removeIcon(icon)
                        })),
                        GameActions.lastingEffect((context) => ({
                            duration: 'untilEndOfPhase',
                            match: context.source,
                            effect: ability.effects.addIcon(icon)
                        }))
                    ]).then({
                        condition: (context) =>
                            context.parentContext.target.getNumberOfIcons() === 0,
                        message: {
                            format: 'Then {player} uses {source} to kill {character}',
                            args: { character: (context) => context.parentContext.target }
                        },
                        gameAction: GameActions.kill((context) => ({
                            card: context.parentContext.target
                        }))
                    })
            })
        });
    }
}

GhostHillElite.code = '26027';

export default GhostHillElite;
