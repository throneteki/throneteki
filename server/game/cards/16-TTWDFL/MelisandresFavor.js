const DrawCard = require('../../drawcard');
const GameActions = require('../../GameActions');

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

module.exports = MelisandresFavor;
