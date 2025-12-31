import DrawCard from '../../drawcard.js';
import GameActions from '../../GameActions/index.js';
import SatisfyClaim from '../../gamesteps/challenge/SatisfyClaim.js';

class AreoHotah extends DrawCard {
    setupCardAbilities(ability) {
        this.reaction({
            when: {
                afterChallenge: (event) =>
                    event.challenge.winner === this.controller && this.isDefending()
            },
            cost: ability.costs.kneelFactionCard(),
            message:
                '{player} uses {source} and kneels their faction card to satisfy claim as if they were the attacking player',
            gameAction: GameActions.genericHandler((context) => {
                const claim = context.event.challenge.claim.clone();
                claim.replaceRecipient(this.controller, context.event.challenge.loser);
                this.game.queueStep(new SatisfyClaim(this.game, claim));
            })
        });
    }
}

AreoHotah.code = '27537';
AreoHotah.version = '1.0.0';

export default AreoHotah;
