import DrawCard from '../../drawcard.js';

class PrinceOfDorne extends DrawCard {
    setupCardAbilities(ability) {
        this.attachmentRestriction({ faction: 'martell', unique: true });
        this.whileAttached({
            effect: ability.effects.addTrait('Lord')
        });
        this.whileAttached({
            condition: () =>
                this.game
                    .getOpponents(this.controller)
                    .some(
                        (opponent) =>
                            this.controller.getNumberOfCardsInPlay({ type: 'character' }) <
                            opponent.getNumberOfCardsInPlay({ type: 'character' })
                    ),
            effect: ability.effects.immuneTo(
                (card) => card.controller !== this.controller && card.getType() === 'plot'
            )
        });
    }
}

PrinceOfDorne.code = '27543';
PrinceOfDorne.version = '1.0.0';

export default PrinceOfDorne;
