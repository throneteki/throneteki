import DrawCard from '../../drawcard.js';

class ObellaSand extends DrawCard {
    setupCardAbilities() {
        this.reaction({
            when: {
                onCharacterKilled: (event) =>
                    event.card === this && this.isApplyingClaim('military'),
                onCardDiscarded: (event) => event.card === this && this.isApplyingClaim('intrigue')
            },
            location: ['dead pile', 'discard pile'],
            handler: (context) => {
                let player = context.player;
                let opponent = this.game.currentChallenge.winner;
                if (opponent !== player && opponent.faction.power > 0) {
                    this.game.addMessage(
                        "{0} uses {1} to move 1 power from {2}'s faction card to their own",
                        player,
                        this,
                        opponent
                    );
                    this.game.movePower(opponent.faction, player.faction, 1);
                }

                this.game.addMessage('{0} shuffles {1} back into their deck', player, this);
                player.moveCard(this, 'draw deck', {}, () => {
                    player.shuffleDrawDeck();
                });
            }
        });
    }

    isApplyingClaim(type) {
        return (
            this.game.currentChallenge &&
            this.game.claim.isApplying &&
            this.game.claim.type === type
        );
    }
}

ObellaSand.code = '10010';

export default ObellaSand;
