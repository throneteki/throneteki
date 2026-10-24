import GameActions from '../../GameActions/index.js';
import DrawCard from '../../drawcard.js';

class OthellYarwyck extends DrawCard {
    // Othell Yarwyck (06065)
    // Action: Kneel a [thenightswatch] location to choose a [thenightswatch] character. Until the
    // end of the phase, that character gains a challenge icon of your choice.
    setupCardAbilities(ability) {
        this.action({
            title: 'Give icon',
            cost: ability.costs.kneel(
                (card) => card.isFaction('thenightswatch') && card.getType() === 'location'
            ),
            target: {
                cardCondition: (card) =>
                    card.location === 'play area' &&
                    card.isFaction('thenightswatch') &&
                    card.getType() === 'character'
            },
            gameAction: GameActions.chooseIcon({
                message:
                    '{player} uses {source} and kneels {costs.kneel} to give {target} {icon} icon until the end of the phase',
                gameAction: (icon) =>
                    GameActions.lastingEffect((context) => ({
                        duration: 'untilEndOfPhase',
                        match: context.target,
                        effect: ability.effects.addIcon(icon)
                    }))
            })
        });
    }
}

OthellYarwyck.code = '06065';

export default OthellYarwyck;
