import DrawCard from '../../drawcard.js';
import GameActions from '../../GameActions/index.js';

class MelisandresFavor extends DrawCard {
    // Melisandre's Favor (16002)
    // Terminal.
    // Take control of attached character.
    // Forced Interrupt: When the dominance phase ends, sacrifice Melisandre's Favor. (Cannot be
    // canceled.)
    setupCardAbilities(ability) {
        this.whileAttached({
            effect: ability.effects.takeControl((context) => context.source.controller)
        });

        this.forcedInterrupt({
            when: {
                onPhaseEnded: (event) => event.phase === 'dominance'
            },
            message: '{player} is forced to sacrifice {source}',
            gameAction: GameActions.sacrificeCard({
                card: this
            }),
            cannotBeCanceled: true
        });
    }
}

MelisandresFavor.code = '16002';

export default MelisandresFavor;
