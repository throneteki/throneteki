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
            condition: (context) =>
                context.game.currentChallenge &&
                context.game.currentChallenge.challengeType === 'military' &&
                context.game.currentChallenge.attackingPlayer === context.source.controller &&
                context.source.controller.isRival(context.game.currentChallenge.defendingPlayer),
            match: (card, context) => card === context.source.controller.activePlot,
            effect: ability.effects.modifyClaim(1)
        });
        this.persistentEffect({
            condition: (context) =>
                context.game.currentChallenge &&
                context.game.currentChallenge.challengeType === 'military' &&
                context.game.currentChallenge.anyParticipants(
                    (card) => card.controller === context.source.controller
                ),
            targetController: 'current',
            effect: ability.effects.contributeStrength(this, 1)
        });
    }
}

MasterOfShips.code = '01207';

export default MasterOfShips;
