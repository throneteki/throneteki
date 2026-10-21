import DrawCard from '../../drawcard.js';

class JoustingPavilion extends DrawCard {
    // Jousting Pavilion (09019)
    // Each Knight character you control gets +1 STR while attacking or defending alone.
    setupCardAbilities(ability) {
        this.persistentEffect({
            condition: (context) =>
                context.game.isDuringChallenge({
                    match: (challenge) => challenge.hasSingleParticipant(context.source.controller)
                }),
            match: (card) =>
                card.hasTrait('Knight') && card.getType() === 'character' && card.isParticipating(),
            effect: ability.effects.modifyStrength(1)
        });
    }
}

JoustingPavilion.code = '09019';

export default JoustingPavilion;
