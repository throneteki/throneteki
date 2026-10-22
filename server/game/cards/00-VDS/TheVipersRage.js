import DrawCard from '../../drawcard.js';
import GameActions from '../../GameActions/index.js';

class TheVipersRage extends DrawCard {
    // The Viper's Rage (00012)
    // Reaction: After you lose a challenge by 5 or more STR as the defending player, each character
    // controlled by the attacking player loses a [military], an [intrigue], and a [power] icon
    // until the end of the phase.
    // Draft format only.
    setupCardAbilities(ability) {
        this.reaction({
            when: {
                afterChallenge: (event, context) =>
                    event.challenge.loser === context.source.controller &&
                    event.challenge.defendingPlayer === context.source.controller &&
                    event.challenge.strengthDifference >= 5
            },
            message: {
                format: '{player} plays {source} to have each character controlled by {attackingPlayer} lose a military, an intrigue and a power icon until the end of the phase',
                args: {
                    attackingPlayer: (context) => context.game.currentChallenge.attackingPlayer
                }
            },
            gameAction: GameActions.lastingEffect((context) => ({
                duration: 'untilEndOfPhase',
                match: context.game.currentChallenge.attackingPlayer.filterCardsInPlay(
                    (card) => card.getType() === 'character'
                ),
                targetController: 'any',
                effect: [
                    ability.effects.removeIcon('military'),
                    ability.effects.removeIcon('intrigue'),
                    ability.effects.removeIcon('power')
                ]
            }))
        });
    }
}

TheVipersRage.code = '00012';

export default TheVipersRage;
