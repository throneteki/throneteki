import DrawCard from '../../drawcard.js';

class SerGilbertFarring extends DrawCard {
    // Ser Gilbert Farring (24002)
    // During a challenge in which a participating character has assault, Ser Gilbert Farring gets
    // +1 STR and gains renown.
    setupCardAbilities(ability) {
        this.persistentEffect({
            condition: (context) =>
                context.game.anyCardsInPlay((card) => card.isParticipating() && card.isAssault()),
            match: this,
            effect: [ability.effects.modifyStrength(1), ability.effects.addKeyword('Renown')]
        });
    }
}

SerGilbertFarring.code = '24002';

export default SerGilbertFarring;
