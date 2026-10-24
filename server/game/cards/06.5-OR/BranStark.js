import DrawCard from '../../drawcard.js';
import GameActions from '../../GameActions/index.js';

class BranStark extends DrawCard {
    // Bran Stark (06081)
    // Action: Kneel Bran Stark to choose and stand a Direwolf character. Until the end of the
    // phase, that character gains a challenge icon of your choice.
    setupCardAbilities(ability) {
        this.action({
            title: 'Stand and give Direwolf icon',
            cost: ability.costs.kneelSelf(),
            target: {
                cardCondition: (card) =>
                    card.location === 'play area' &&
                    card.hasTrait('Direwolf') &&
                    card.getType() === 'character'
            },
            gameAction: GameActions.chooseIcon({
                message:
                    '{player} kneels {source} to stand and give {icon} icon to {target} until the end of the phase',
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

BranStark.code = '06081';

export default BranStark;
