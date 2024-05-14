import DrawCard from '../../drawcard.js';
import GameActions from '../../GameActions/index.js';

class MelisandresFavor extends DrawCard {
    setupCardAbilities(ability) {
        this.whileAttached({
            effect: ability.effects.takeControl(() => this.controller)
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
