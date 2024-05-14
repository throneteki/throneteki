import DrawCard from '../../drawcard.js';

class Extortion extends DrawCard {
    setupCardAbilities() {
        this.reaction({
            when: {
                afterChallenge: (event) =>
                    event.challenge.attackingPlayer === this.controller &&
                    event.challenge.winner === this.controller &&
                    event.challenge.challengeType === 'intrigue' &&
                    (this.controller.canGainGold() || event.challenge.loser.gold > 1)
            },
            handler: (context) => {
                let gainGold = this.game.addGold(context.player, 3);

                let loser = context.event.challenge.loser;
                let returnGold = Math.min(loser.gold, 3);
                this.game.returnGoldToTreasury({ player: loser, amount: returnGold });

                this.game.addMessage(
                    "{0} plays {1} to gain {2} gold and return {3} gold from {4}'s gold pool to the treasury",
                    context.player,
                    this,
                    gainGold,
                    returnGold,
                    loser
                );
            }
        });
    }
}

Extortion.code = '10030';

export default Extortion;
