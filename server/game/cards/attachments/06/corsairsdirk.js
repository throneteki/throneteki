const DrawCard = require('../../../drawcard.js');

class CorsairsDirk extends DrawCard {
    setupCardAbilities(ability) {
        this.whileAttached({
            effect: ability.effects.modifyStrength(2)
        });

        this.reaction({
            when: {
                afterChallenge: (event, challenge) => (
                    challenge.winner === this.controller && 
                    challenge.isAttacking(this.parent) && 
                    this.opponentHasGold())
            },
            handler: () => {
                let opponent = this.game.getOtherPlayer(this.controller);
                this.game.addGold(opponent, -1);
                this.game.addGold(this.controller, 1);
                this.game.addMessage('{0} uses {1} to move 1 gold from {2}\'s gold pool to their own', 
                                      this.controller, this, opponent);
            }
        });
    }

    opponentHasGold() {
        let opponent = this.game.getOtherPlayer(this.controller);
        return opponent && opponent.gold >= 1;
    }

    canAttach(player, card) {
        if(card.getType() !== 'character' || !card.hasTrait('ironborn')) {
            return false;
        }

        return super.canAttach(player, card);
    }
}

CorsairsDirk.code = '06052';

module.exports = CorsairsDirk;
