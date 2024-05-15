import DrawCard from '../../drawcard.js';

class BastardDaughter extends DrawCard {
    setupCardAbilities() {
        this.interrupt({
            when: {
                onCharacterKilled: (event) =>
                    event.card === this || event.card.name === 'The Red Viper'
            },
            handler: () => {
                this.game.addMessage(
                    "{0} uses {1} to discard 1 card at random from each opponent's hand",
                    this.controller,
                    this
                );

                for (let opponent of this.game.getOpponents(this.controller)) {
                    opponent.discardAtRandom(1);
                }
            }
        });
    }
}

BastardDaughter.code = '02015';

export default BastardDaughter;
