import TitleCard from '../../TitleCard.js';

class CrownRegent extends TitleCard {
    setupCardAbilities(ability) {
        this.persistentEffect({
            match: this,
            effect: ability.effects.modifyDominanceStrength(2)
        });

        this.interrupt({
            cannotBeCanceled: true,
            location: 'title',
            when: {
                onChallengeInitiated: () => true
            },
            message: {
                format: '{player} uses {source} to force {initiatingPlayer} to redirect the challenge to another player',
                args: { initiatingPlayer: (context) => context.event.challenge.initiatingPlayer }
            },
            handler: (context) => {
                const challenge = context.event.challenge;
                this.game.promptForOpponentChoice(challenge.initiatingPlayer, {
                    enabled: (opponent) => opponent !== challenge.defendingPlayer,
                    onSelect: (opponent) => {
                        this.game.currentChallengeStep.redirectChallengeTo(opponent);
                        this.game.addMessage(
                            '{0} has chosen to redirect the challenge to {1}',
                            context.player,
                            opponent
                        );
                    },
                    onCancel: () => {
                        this.game.addAlert(
                            'danger',
                            '{0} cancels the challenge redirect',
                            challenge.initiatingPlayer
                        );
                    }
                });
            },
            limit: ability.limit.perRound(1)
        });
    }
}

CrownRegent.code = '01211';

export default CrownRegent;
