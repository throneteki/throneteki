import DrawCard from '../../drawcard.js';

class CorsairsDirk extends DrawCard {
    setupCardAbilities(ability) {
        this.attachmentRestriction({ trait: 'Ironborn' });

        this.whileAttached({
            effect: ability.effects.modifyStrength(2)
        });

        this.reaction({
            when: {
                afterChallenge: (event) =>
                    event.challenge.winner === this.controller &&
                    event.challenge.isAttacking(this.parent) &&
                    event.challenge.defendingPlayer.gold >= 1
            },
            handler: (context) => {
                let opponent = context.event.challenge.defendingPlayer;
                this.game.transferGold({ from: opponent, to: this.controller, amount: 1 });
                this.game.addMessage(
                    "{0} uses {1} to move 1 gold from {2}'s gold pool to their own",
                    this.controller,
                    this,
                    opponent
                );
            }
        });
    }
}

CorsairsDirk.code = '06052';

export default CorsairsDirk;
