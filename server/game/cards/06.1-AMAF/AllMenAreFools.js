import DrawCard from '../../drawcard.js';
import GameActions from '../../GameActions/index.js';

class AllMenAreFools extends DrawCard {
    // All Men Are Fools (06004)
    // Reaction: After you win a challenge by 5 or more STR, each Lady character you control gains 1
    // power. (Max 1 per challenge.)
    setupCardAbilities(ability) {
        this.reaction({
            max: ability.limit.perChallenge(1),
            when: {
                afterChallenge: (event, context) =>
                    event.challenge.winner === context.player &&
                    event.challenge.strengthDifference >= 5
            },
            message: {
                format: '{player} plays {source} to have {ladies} gain 1 power',
                args: { ladies: (context) => ladies(context) }
            },
            gameAction: GameActions.simultaneously((context) =>
                ladies(context).map((card) => GameActions.gainPower({ card, amount: 1 }))
            )
        });
    }
}

function ladies(context) {
    return context.player.filterCardsInPlay(
        (card) => card.hasTrait('Lady') && card.getType() === 'character'
    );
}

AllMenAreFools.code = '06004';

export default AllMenAreFools;
