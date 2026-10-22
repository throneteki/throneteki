import DrawCard from '../../drawcard.js';
import GameActions from '../../GameActions/index.js';

class ArrogantContender extends DrawCard {
    // Arrogant Contender (13023)
    // While Arrogant Contender is participating in a challenge, it gets +1 STR for each
    // participating character an opponent controls.
    // Reaction: After you win a challenge in which Arrogant Contender is attacking alone, it gains
    // 1 power for each defending character (to a maximum of 3 power).
    setupCardAbilities(ability) {
        this.persistentEffect({
            condition: (context) =>
                context.game.isDuringChallenge() && context.source.isParticipating(),
            match: (card, context) => card === context.source,
            effect: ability.effects.dynamicStrength((card) => opponentParticipants(card))
        });

        this.reaction({
            when: {
                afterChallenge: (event, context) =>
                    event.challenge.isMatch({
                        winner: context.player,
                        attackingAlone: context.source
                    })
            },
            message: {
                format: '{player} uses {source} to have it gain {gainedPower} power',
                args: { gainedPower: (context) => gainedPower(context) }
            },
            gameAction: GameActions.gainPower((context) => ({
                card: context.source,
                amount: gainedPower(context)
            }))
        });
    }
}

function opponentParticipants(card) {
    return card.game.currentChallenge
        .getParticipants()
        .filter((participant) => participant.controller !== card.controller).length;
}

function gainedPower(context) {
    return Math.min(
        context.event.challenge
            .getParticipants()
            .filter((card) => card.controller !== context.player).length,
        3
    );
}

ArrogantContender.code = '13023';

export default ArrogantContender;
