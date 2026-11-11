import DrawCard from '../../drawcard.js';
import GameActions from '../../GameActions/index.js';

class SerHarryStrickland extends DrawCard {
    // Ser Harry Strickland (26073)
    // Renown. Shadow (3).
    // Reaction: After Ser Harry Strickland enters play, choose and stand a Mercenary character.
    // Until the end of the phase, that character gains a challenge icon of your choice.
    setupCardAbilities(ability) {
        this.reaction({
            when: {
                onCardEntersPlay: (event, context) => event.card === context.source
            },
            target: {
                cardCondition: {
                    location: 'play area',
                    type: 'character',
                    trait: 'Mercenary'
                }
            },
            gameAction: GameActions.chooseIcon({
                message:
                    '{player} uses {source} to stand and give {target} {icon} icon until the end of the phase',
                gameAction: (icon) =>
                    GameActions.simultaneously([
                        GameActions.standCard((context) => ({ card: context.target })),
                        GameActions.lastingEffect((context) => ({
                            duration: 'untilEndOfPhase',
                            match: context.target,
                            effect: ability.effects.addIcon(icon)
                        }))
                    ])
            })
        });
    }
}

SerHarryStrickland.code = '26073';

export default SerHarryStrickland;
