import DrawCard from '../../drawcard.js';

class BlackEars extends DrawCard {
    // Black Ears (08029)
    // Reaction: After a character is killed, pay 2 gold to put Black Ears into play from your hand.
    setupCardAbilities(ability) {
        this.reaction({
            when: {
                onCharacterKilled: () => this.controller.canPutIntoPlay(this)
            },
            location: 'hand',
            cost: ability.costs.payGold(2),
            handler: (context) => {
                this.controller.putIntoPlay(this);
                this.game.addMessage(
                    '{0} pays 2 gold to put {1} into play from their hand',
                    context.player,
                    this
                );
            }
        });
    }
}

BlackEars.code = '08029';

export default BlackEars;
