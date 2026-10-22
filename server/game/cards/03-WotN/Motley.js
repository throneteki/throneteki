import DrawCard from '../../drawcard.js';
import GameActions from '../../GameActions/index.js';

class Motley extends DrawCard {
    // Motley (03025)
    // Opponent's character only.
    // Attached character gains the Fool trait.
    // Reaction: After attached character is declared as an attacker or defender, discard 1 card at
    // random from its controller's hand.
    setupCardAbilities(ability) {
        this.attachmentRestriction({ controller: 'opponent' });
        this.whileAttached({
            effect: ability.effects.addTrait('Fool')
        });
        this.reaction({
            when: {
                onDeclaredAsAttacker: (event, context) => event.card === context.source.parent,
                onDeclaredAsDefender: (event, context) => event.card === context.source.parent
            },
            message: {
                format: "{player} uses {source} to discard 1 card at random from {opponent}'s hand",
                args: { opponent: (context) => context.source.parent.controller }
            },
            gameAction: GameActions.discardAtRandom((context) => ({
                player: context.source.parent.controller,
                amount: 1
            }))
        });
    }
}

Motley.code = '03025';

export default Motley;
