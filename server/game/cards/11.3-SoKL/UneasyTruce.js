import PlotCard from '../../plotcard.js';
import GameActions from '../../GameActions/index.js';

class UneasyTruce extends PlotCard {
    // Uneasy Truce (11060)
    // Each player cannot gain power for his or her faction except during challenges.
    // Forced Reaction: After a challenge is initiated, move 1 power from the attacking player's
    // faction card to the defending player's faction card.
    setupCardAbilities(ability) {
        this.persistentEffect({
            condition: (context) => !context.game.isDuringChallenge(),
            match: (card) => card.getType() === 'faction',
            targetLocation: 'faction',
            targetController: 'any',
            effect: ability.effects.cannotGainPower()
        });

        this.forcedReaction({
            when: {
                onChallengeInitiated: () => true
            },
            message: {
                format: "{attackingPlayer} is forced by {source} to move 1 power from their faction to {defendingPlayer}'s faction",
                args: {
                    attackingPlayer: (context) => context.event.challenge.attackingPlayer,
                    defendingPlayer: (context) => context.event.challenge.defendingPlayer
                }
            },
            gameAction: GameActions.movePower((context) => ({
                from: context.event.challenge.attackingPlayer.faction,
                to: context.event.challenge.defendingPlayer.faction,
                amount: 1
            }))
        });
    }
}

UneasyTruce.code = '11060';

export default UneasyTruce;
