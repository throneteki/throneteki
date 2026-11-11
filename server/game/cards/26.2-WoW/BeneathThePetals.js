import DrawCard from '../../drawcard.js';
import GameActions from '../../GameActions/index.js';

class BeneathThePetals extends DrawCard {
    // Beneath the Petals (26036)
    // Shadow (0).
    // Action: Choose a character with shadow. Until the end of the phase, that character gains
    // insight and a challenge icon of your choice.
    // Interrupt: When Beneath the Petals is revealed from your deck, place it in shadows and gain 1
    // gold.
    setupCardAbilities(ability) {
        this.action({
            title: 'Give icon and insight',
            target: {
                cardCondition: {
                    type: 'character',
                    location: 'play area',
                    shadow: true
                }
            },
            message:
                '{player} plays {source} to give {target} insight and a challenge icon of their choice until the end of the phase',
            gameAction: GameActions.chooseIcon({
                message:
                    '{player} chooses to have {target} gain {icon} icon and insight until the end of the phase',
                gameAction: (icon) =>
                    GameActions.lastingEffect((context) => ({
                        duration: 'untilEndOfPhase',
                        match: context.target,
                        effect: [
                            ability.effects.addIcon(icon),
                            ability.effects.addKeyword('insight')
                        ]
                    }))
            })
        });
        this.interrupt({
            when: {
                onCardRevealed: (event, context) =>
                    event.card === context.source && event.card.location === 'draw deck'
            },
            ignoreEventCosts: true,
            location: 'draw deck',
            message: '{player} places {source} in shadows and gains 1 gold',
            gameAction: GameActions.simultaneously([
                GameActions.placeCard((context) => ({ card: context.source, location: 'shadows' })),
                GameActions.gainGold((context) => ({ player: context.player, amount: 1 }))
            ])
        });
    }
}

BeneathThePetals.code = '26036';

export default BeneathThePetals;
