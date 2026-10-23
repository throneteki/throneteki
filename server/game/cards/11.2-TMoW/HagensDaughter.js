import DrawCard from '../../drawcard.js';
import GameActions from '../../GameActions/index.js';

class HagensDaughter extends DrawCard {
    // Hagen's Daughter (11031)
    // Shadow (2).
    // Interrupt: When Hagen’s Daughter would be killed, save her and return her to shadows.
    setupCardAbilities() {
        this.interrupt({
            canCancel: true,
            when: {
                onCharacterKilled: (event, context) => event.card === context.source
            },
            message: '{player} saves {source} and returns her to shadows',
            gameAction: GameActions.saveCard((context) => ({
                event: context.event,
                remediesBurn: true
            })).then({
                gameAction: GameActions.putIntoShadows((context) => ({ card: context.source }))
            })
        });
    }
}

HagensDaughter.code = '11031';

export default HagensDaughter;
