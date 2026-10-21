import DrawCard from '../../drawcard.js';

class TommenBaratheon extends DrawCard {
    // Tommen Baratheon (05015)
    // Each player with no cards in his or her hand cannot gain power from challenge bonuses
    // (unopposed and rivals).
    setupCardAbilities(ability) {
        this.persistentEffect({
            targetController: 'any',
            match: (player) => player.getHandCount() === 0,
            effect: ability.effects.cannotGainChallengeBonus()
        });
    }
}

TommenBaratheon.code = '05015';

export default TommenBaratheon;
