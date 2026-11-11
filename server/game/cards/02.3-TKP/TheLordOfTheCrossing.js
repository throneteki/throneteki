import AgendaCard from '../../agendacard.js';
import GameActions from '../../GameActions/index.js';

class TheLordOfTheCrossing extends AgendaCard {
    // The Lord of the Crossing (02060)
    // During the first challenge you initiate each phase, each of your participating characters
    // gets -1 STR.
    // During the third challenge you initiate each phase, each of your participating characters
    // gets +2 STR. If you win this challenge, gain 1 power for your faction.
    setupCardAbilities(ability) {
        this.persistentEffect({
            condition: (context) =>
                context.game.isDuringChallenge({
                    attackingPlayer: context.source.controller,
                    number: 1
                }),
            match: (card) => card.isAttacking(),
            effect: ability.effects.modifyStrength(-1)
        });
        this.persistentEffect({
            condition: (context) =>
                context.game.isDuringChallenge({
                    attackingPlayer: context.source.controller,
                    number: 3
                }),
            match: (card) => card.isAttacking(),
            effect: ability.effects.modifyStrength(2)
        });
        this.eventCheck({
            when: {
                afterChallenge: (event, context) =>
                    event.challenge.attackingPlayer === context.player &&
                    event.challenge.number === 3 &&
                    event.challenge.winner === context.player
            },
            message: '{player} gains 1 power from {source}',
            gameAction: GameActions.gainPower((context) => ({
                card: context.player.faction,
                amount: 1
            }))
        });
    }
}

TheLordOfTheCrossing.code = '02060';

export default TheLordOfTheCrossing;
