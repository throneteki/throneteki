import DrawCard from '../../drawcard.js';

class BlackEars extends DrawCard {
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
