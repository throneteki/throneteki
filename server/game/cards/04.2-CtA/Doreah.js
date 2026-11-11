import DrawCard from '../../drawcard.js';

class Doreah extends DrawCard {
    // Doreah (04033)
    // During a challenge in which you control a participating Lord or Lady character, Doreah gains
    // insight.
    setupCardAbilities(ability) {
        this.persistentEffect({
            condition: (context) => context.source.hasParticipatingLordOrLady(),
            match: this,
            effect: ability.effects.addKeyword('Insight')
        });
    }

    hasParticipatingLordOrLady() {
        let challenge = this.game.currentChallenge;
        if (!challenge) {
            return false;
        }

        let ourCards =
            challenge.attackingPlayer === this.controller
                ? challenge.attackers
                : challenge.defenders;
        return ourCards.some((card) => card.hasTrait('Lord') || card.hasTrait('Lady'));
    }
}

Doreah.code = '04033';

export default Doreah;
