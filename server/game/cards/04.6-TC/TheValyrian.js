import GameActions from '../../GameActions/index.js';
import DrawCard from '../../drawcard.js';

class TheValyrian extends DrawCard {
    // The Valyrian (04108)
    // Ambush (2).
    // Action: Kneel The Valyrian to give an attacking character +X STR until the end of the
    // challenge. X is the number of gold in the defending player's gold pool.
    setupCardAbilities(ability) {
        this.action({
            title: 'Give attacking character +STR',
            condition: (context) =>
                context.game.currentChallenge &&
                context.game.currentChallenge.defendingPlayer.gold >= 1,
            cost: ability.costs.kneelSelf(),
            target: {
                cardCondition: (card) => card.location === 'play area' && card.isAttacking()
            },
            message: {
                format: '{player} kneels {source} to give {target} +{strBoost} STR until the end of the challenge',
                args: { strBoost: (context) => context.game.currentChallenge.defendingPlayer.gold }
            },
            gameAction: GameActions.lastingEffect((context) => ({
                duration: 'untilEndOfChallenge',
                match: context.target,
                effect: ability.effects.modifyStrength(
                    context.game.currentChallenge.defendingPlayer.gold
                )
            }))
        });
    }
}

TheValyrian.code = '04108';

export default TheValyrian;
