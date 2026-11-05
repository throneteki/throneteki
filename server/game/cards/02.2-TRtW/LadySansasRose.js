import DrawCard from '../../drawcard.js';
import GameActions from '../../GameActions/index.js';

class LadySansasRose extends DrawCard {
    // Lady Sansa's Rose (02024)
    // Reaction: After you win a challenge in which you control a Knight character that is attacking
    // or defending alone, that character gains 1 power. (3 power instead if you control a Lady
    // character.) (Max 1 per challenge.)
    setupCardAbilities(ability) {
        this.reaction({
            when: {
                afterChallenge: (event, context) =>
                    event.challenge.winner === context.player &&
                    !!loneKnight(event.challenge, context)
            },
            max: ability.limit.perChallenge(1),
            message: {
                format: '{player} plays {source} to have {knight} gain {power} power',
                args: {
                    knight: (context) => loneKnight(context.event.challenge, context),
                    power: (context) => rosePower(context)
                }
            },
            gameAction: GameActions.gainPower((context) => ({
                card: loneKnight(context.event.challenge, context),
                amount: rosePower(context)
            }))
        });
    }
}

function loneKnight(challenge, context) {
    const participants =
        challenge.attackingPlayer === context.player ? challenge.attackers : challenge.defenders;
    if (participants.length !== 1) {
        return undefined;
    }
    const [character] = participants;
    return character.hasTrait('Knight') && character.getType() === 'character'
        ? character
        : undefined;
}

function rosePower(context) {
    return context.player.anyCardsInPlay(
        (card) => card.hasTrait('Lady') && card.getType() === 'character'
    )
        ? 3
        : 1;
}

LadySansasRose.code = '02024';

export default LadySansasRose;
