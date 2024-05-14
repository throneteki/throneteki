const DrawCard = require('../../drawcard.js');

class JoustingPavilion extends DrawCard {
    setupCardAbilities(ability) {
        this.persistentEffect({
            condition: () =>
                this.game.isDuringChallenge({
                    match: (challenge) => challenge.hasSingleParticipant(this.controller)
                }),
            match: (card) =>
                card.hasTrait('Knight') && card.getType() === 'character' && card.isParticipating(),
            effect: ability.effects.modifyStrength(1)
        });
    }
}

JoustingPavilion.code = '09019';

module.exports = JoustingPavilion;
