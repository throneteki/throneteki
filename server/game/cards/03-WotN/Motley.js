import DrawCard from '../../drawcard.js';

class Motley extends DrawCard {
    setupCardAbilities(ability) {
        this.attachmentRestriction({ controller: 'opponent' });
        this.whileAttached({
            effect: ability.effects.addTrait('Fool')
        });
        this.reaction({
            when: {
                onDeclaredAsAttacker: (event) => event.card === this.parent,
                onDeclaredAsDefender: (event) => event.card === this.parent
            },
            handler: () => {
                this.parent.controller.discardAtRandom(1);
                this.game.addMessage(
                    "{0} uses {1} to discard 1 card at random from {2}'s hand",
                    this.controller,
                    this,
                    this.parent.controller
                );
            }
        });
    }
}

Motley.code = '03025';

export default Motley;
