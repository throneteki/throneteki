import PlotCard from '../../plotcard.js';

class UneasyTruce extends PlotCard {
    // Uneasy Truce (11060)
    // Each player cannot gain power for his or her faction except during challenges.
    // Forced Reaction: After a challenge is initiated, move 1 power from the attacking player's
    // faction card to the defending player's faction card.
    setupCardAbilities(ability) {
        this.persistentEffect({
            condition: () => !this.game.isDuringChallenge(),
            match: (card) => card.getType() === 'faction',
            targetLocation: 'faction',
            targetController: 'any',
            effect: ability.effects.cannotGainPower()
        });

        this.forcedReaction({
            when: {
                onChallengeInitiated: (event) => event.challenge.attackingPlayer.faction.power > 0
            },
            handler: (context) => {
                let { attackingPlayer, defendingPlayer } = context.event.challenge;
                this.game.addMessage(
                    "{0} is forced by {1} to move 1 power from their faction to {2}'s faction",
                    attackingPlayer,
                    this,
                    defendingPlayer
                );
                this.game.movePower(attackingPlayer.faction, defendingPlayer.faction, 1);
            }
        });
    }
}

UneasyTruce.code = '11060';

export default UneasyTruce;
