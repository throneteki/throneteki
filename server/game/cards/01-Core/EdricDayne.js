import GameActions from '../../GameActions/index.js';
import DrawCard from '../../drawcard.js';

class EdricDayne extends DrawCard {
    // Edric Dayne (01106)
    // Stealth.
    // Action: Pay 1 gold to give Edric Dayne a challenge icon of your choice until the end of the
    // phase.
    setupCardAbilities(ability) {
        this.action({
            title: 'Give icon',
            cost: ability.costs.payGold(1),
            gameAction: GameActions.chooseIcon({
                message:
                    '{player} pays 1 gold to give {source} {icon} icon until the end of the phase',
                gameAction: (icon) =>
                    GameActions.lastingEffect((context) => ({
                        duration: 'untilEndOfPhase',
                        match: context.source,
                        effect: ability.effects.addIcon(icon)
                    }))
            })
        });
    }
}

EdricDayne.code = '01106';

export default EdricDayne;
