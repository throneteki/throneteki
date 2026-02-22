import DrawCard from '../../drawcard.js';
import GameActions from '../../GameActions/index.js';

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
            gameAction: GameActions.applyClaim((context) => {
                const claim = context.event.claim.clone();
                return { player: context.player, claim, game: this.game };
            })
        });
    }
}

AreoHotah.code = '27537';
AreoHotah.version = '1.0.0';

export default AreoHotah;
