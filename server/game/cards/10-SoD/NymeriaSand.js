import DrawCard from '../../drawcard.js';

class NymeriaSand extends DrawCard {
    // Nymeria Sand (10007)
    // Reaction: After you lose dominance, discard 1 card at random from the winning opponent's hand
    // and draw 1 card.
    setupCardAbilities() {
        this.reaction({
            when: {
                onDominanceDetermined: (event) => event.winner && this.controller !== event.winner
            },
            handler: (context) => {
                context.event.winner.discardAtRandom(1);
                context.player.drawCardsToHand(1);
                this.game.addMessage(
                    "{0} uses {1} to discard 1 card at random from {2}'s hand and draw 1 card",
                    context.player,
                    this,
                    context.event.winner
                );
            }
        });
    }
}

NymeriaSand.code = '10007';

export default NymeriaSand;
