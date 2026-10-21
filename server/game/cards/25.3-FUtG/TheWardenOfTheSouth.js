import DrawCard from '../../drawcard.js';
import GameActions from '../../GameActions/index.js';

class TheWardenOfTheSouth extends DrawCard {
    // The Warden of the South (25056)
    // [tyrell] Lord character only.
    // Attached character gets +1 STR and gains the Commander trait.
    // Reaction: After attached character's STR is increased by a card effect, kneel The Warden of
    // the South to stand attached character.
    setupCardAbilities(ability) {
        this.attachmentRestriction({ faction: 'tyrell', trait: 'Lord' });

        this.whileAttached({
            effect: [ability.effects.addTrait('Commander'), ability.effects.modifyStrength(1)]
        });

        this.reaction({
            when: {
                onCardStrengthChanged: (event) =>
                    this.parent && event.card === this.parent && event.amount > 0 && event.applying
            },
            cost: ability.costs.kneelSelf(),
            message: {
                format: '{player} kneels {costs.kneel} to stand {parent}',
                args: { parent: () => this.parent }
            },
            gameAction: GameActions.standCard(() => ({ card: this.parent }))
        });
    }
}

TheWardenOfTheSouth.code = '25056';

export default TheWardenOfTheSouth;
