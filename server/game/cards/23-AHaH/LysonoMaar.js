import DrawCard from '../../drawcard.js';

class LysonoMaar extends DrawCard {
    // Lysono Maar (23013)
    // Insight.
    // During the first challenge you initiate each phase, defenders are declared before you declare
    // attackers. (Attackers and defenders are knelt simultaneously as part of initiating the
    // challenge.)
    setupCardAbilities(ability) {
        this.persistentEffect({
            condition: (context) =>
                context.game.isDuringChallenge({
                    attackingPlayer: context.source.controller,
                    number: 1
                }),
            effect: ability.effects.declareDefendersBeforeAttackers()
        });
    }
}

LysonoMaar.code = '23013';

export default LysonoMaar;
