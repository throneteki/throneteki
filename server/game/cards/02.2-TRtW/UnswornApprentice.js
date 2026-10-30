import GameActions from '../../GameActions/index.js';
import DrawCard from '../../drawcard.js';

class UnswornApprentice extends DrawCard {
    // Unsworn Apprentice (02025)
    // No attachments except Weapon.
    // Challenges Action: Unsworn Apprentice gains a challenge icon of your choice until the end of
    // the phase. (Limit once per phase.)
    setupCardAbilities(ability) {
        this.action({
            title: 'Gain icon',
            phase: 'challenge',
            limit: ability.limit.perPhase(1),
            gameAction: GameActions.chooseIcon({
                message:
                    '{player} uses {source} to have {source} gain {icon} icon until the end of the phase',
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

UnswornApprentice.code = '02025';

export default UnswornApprentice;
