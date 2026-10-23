import TitleCard from '../../TitleCard.js';

class MasterOfWhispers extends TitleCard {
    // Master of Whispers (01206)
    // Supported by Master of Ships
    // Supports: Hand of the King
    // Rivals: Master of Laws, Master of Coin
    // You may resolve your [intrigue] claim against any number of opponents of your choice.
    // +1 STR [intrigue]
    setupCardAbilities(ability) {
        this.supports('Hand of the King');
        this.rivals('Master of Laws', 'Master of Coin');
        this.persistentEffect({
            targetController: 'current',
            effect: ability.effects.applyClaimToAnyOpponents('intrigue')
        });
        this.persistentEffect({
            condition: (context) =>
                context.game.currentChallenge &&
                context.game.currentChallenge.challengeType === 'intrigue' &&
                context.game.currentChallenge.anyParticipants(
                    (card) => card.controller === context.source.controller
                ),
            targetController: 'current',
            effect: ability.effects.contributeStrength(this, 1)
        });
    }
}

MasterOfWhispers.code = '01206';

export default MasterOfWhispers;
