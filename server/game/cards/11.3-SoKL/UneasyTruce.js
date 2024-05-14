const PlotCard = require('../../plotcard');

class UneasyTruce extends PlotCard {
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

module.exports = UneasyTruce;
