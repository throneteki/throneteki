import DrawCard from '../../drawcard.js';

class SerGilbertFarring extends DrawCard {
    setupCardAbilities(ability) {
        this.persistentEffect({
            condition: () =>
                this.game.anyCardsInPlay((card) => card.isParticipating() && card.isAssault()),
            match: this,
            effect: [ability.effects.modifyStrength(1), ability.effects.addKeyword('Renown')]
        });
    }
}

SerGilbertFarring.code = '24002';

export default SerGilbertFarring;
