import TitleCard from '../../TitleCard.js';

class MasterOfShips extends TitleCard {
    // Master of Ships (01207)
    // Supported by Master of Coin
    // Supports: Master of Whispers
    // Rivals: Master of Laws, Hand of the King
    // Raise the claim value on your revealed plot card by 1 during [military] challenges in which
    // you are attacking a rival.
    // +1 STR [military]
    setupCardAbilities(ability) {
        this.supports('Master of Whispers');
        this.rivals('Master of Laws', 'Hand of the King');
        this.persistentEffect({
            condition: () =>
                this.game.currentChallenge &&
                this.game.currentChallenge.challengeType === 'military' &&
                this.game.currentChallenge.attackingPlayer === this.controller &&
                this.controller.isRival(this.game.currentChallenge.defendingPlayer),
            match: (card) => card === this.controller.activePlot,
            effect: ability.effects.modifyClaim(1)
        });
        this.persistentEffect({
            condition: () =>
                this.game.currentChallenge &&
                this.game.currentChallenge.challengeType === 'military' &&
                this.game.currentChallenge.anyParticipants(
                    (card) => card.controller === this.controller
                ),
            targetController: 'current',
            effect: ability.effects.contributeStrength(this, 1)
        });
    }
}

MasterOfShips.code = '01207';

export default MasterOfShips;
