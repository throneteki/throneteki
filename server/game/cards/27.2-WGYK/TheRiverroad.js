import GameActions from '../../GameActions/index.js';
import DrawCard from '../../drawcard.js';

class TheRiverroad extends DrawCard {
    // The Riverroad (27038)
    // Limited.
    // Action: Kneel and sacrifice The Riverroad to choose a character. Until the end of the phase,
    // that character gains a challenge icon of your choice.
    // +1 Income.
    setupCardAbilities(ability) {
        this.plotModifiers({
            gold: 1
        });
        this.action({
            title: 'Give a character a challenge icon',
            cost: [ability.costs.kneelSelf(), ability.costs.sacrificeSelf()],
            target: {
                cardCondition: (card) =>
                    card.location === 'play area' && card.getType() === 'character'
            },
            gameAction: GameActions.chooseIcon({
                message:
                    '{player} kneels and sacrifices {source} to have {target} gain {icon} icon until the end of the phase',
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

TheRiverroad.code = '27038';

export default TheRiverroad;
