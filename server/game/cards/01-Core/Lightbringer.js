import DrawCard from '../../drawcard.js';

class Lightbringer extends DrawCard {
    setupCardAbilities(ability) {
        this.attachmentRestriction({ faction: 'baratheon' });
        this.whileAttached({
            match: (card) => card.name === 'Stannis Baratheon',
            effect: ability.effects.addKeyword('Renown')
        });
        this.reaction({
            when: {
                onCardPowerGained: (event) => event.card === this.parent && event.card.kneeled
            },
            limit: ability.limit.perPhase(1),
            handler: () => {
                this.parent.controller.standCard(this.parent);

                this.game.addMessage(
                    '{0} uses {1} to stand {2}',
                    this.controller,
                    this,
                    this.parent
                );
            }
        });
    }
}

Lightbringer.code = '01058';

export default Lightbringer;
