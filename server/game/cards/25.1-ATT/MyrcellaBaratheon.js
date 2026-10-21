import DrawCard from '../../drawcard.js';
import GameActions from '../../GameActions/index.js';

class MyrcellaBaratheon extends DrawCard {
    // Myrcella Baratheon (25005)
    // Reaction: After you win a challenge in which Myrcella Baratheon is participating, return her
    // to your hand. Then, you may initiate an additional [intrigue] challenge against the losing
    // opponent this phase. (Max once per phase.)
    setupCardAbilities(ability) {
        this.reaction({
            when: {
                afterChallenge: (event) =>
                    event.challenge.winner === this.controller && this.isParticipating()
            },
            max: ability.limit.perPhase(1),
            message: '{player} returns {source} to their hand',
            gameAction: GameActions.returnCardToHand({ card: this }).then({
                message: {
                    format: 'Then, {player} may initiate an additional intrigue challenge this phase against {opponent}',
                    args: { opponent: (context) => context.parentContext.event.challenge.loser }
                },
                gameAction: GameActions.genericHandler((context) => {
                    this.untilEndOfPhase((ability) => ({
                        targetController: 'current',
                        effect: ability.effects.mayInitiateAdditionalChallenge(
                            'intrigue',
                            (opponent) => opponent === context.parentContext.event.challenge.loser
                        )
                    }));
                })
            })
        });
    }
}

MyrcellaBaratheon.code = '25005';

export default MyrcellaBaratheon;
