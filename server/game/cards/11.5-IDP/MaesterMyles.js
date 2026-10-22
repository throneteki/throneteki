import DrawCard from '../../drawcard.js';
import GameActions from '../../GameActions/index.js';

class MaesterMyles extends DrawCard {
    // Maester Myles (11095)
    // Challenges Action: Kneel Maester Myles to choose a character with printed cost equal to or
    // lower than the number of plot cards in your used pile. Until the end of the phase, that
    // character loses a challenge icon of your choice.
    setupCardAbilities(ability) {
        this.action({
            title: 'Remove icon',
            phase: 'challenge',
            cost: ability.costs.kneelSelf(),
            target: {
                cardCondition: (card, context) =>
                    card.location === 'play area' &&
                    card.getType() === 'character' &&
                    card.getPrintedCost() <= context.player.getNumberOfUsedPlots()
            },
            gameAction: GameActions.chooseIcon({
                message:
                    '{player} kneels {source} to remove {icon} icon from {target} until the end of the phase',
                gameAction: (icon) =>
                    GameActions.lastingEffect((context) => ({
                        duration: 'untilEndOfPhase',
                        match: context.target,
                        effect: ability.effects.removeIcon(icon)
                    }))
            })
        });
    }
}

MaesterMyles.code = '11095';

export default MaesterMyles;
