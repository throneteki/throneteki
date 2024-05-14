import GameActions from '../../GameActions/index.js';
import DrawCard from '../../drawcard.js';

class TywinLannister extends DrawCard {
    setupCardAbilities(ability) {
        this.reaction({
            when: {
                afterChallenge: (event) =>
                    event.challenge.winner === this.controller && this.isParticipating()
            },
            message: {
                format: '{player} uses {source} to have {source} gain {amount} power',
                args: { amount: (context) => this.getPowerAmount(context) }
            },
            limit: ability.limit.perPhase(1),
            gameAction: GameActions.gainPower((context) => ({
                card: this,
                amount: this.getPowerAmount(context)
            }))
        });
    }

    getPowerAmount(context) {
        return Math.floor(context.player.gold / 3);
    }
}

TywinLannister.code = '25025';

export default TywinLannister;
