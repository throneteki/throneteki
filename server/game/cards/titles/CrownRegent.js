const TitleCard = require('../../TitleCard.js');
const InitiatingKeywordsWindow = require('../../gamesteps/InitiatingKeywordsWindow.js');

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
            handler: (context) => {
                const challenge = context.event.challenge;
                this.game.promptForOpponentChoice(challenge.attackingPlayer, {
                    enabled: (opponent) => opponent !== challenge.defendingPlayer,
                    onSelect: (opponent) => {
                        challenge.defendingPlayer = opponent;
                        challenge.clearInitiationActions();
                        this.game.queueStep(new InitiatingKeywordsWindow(this.game, challenge));
                    },
                    onCancel: () => {
                        this.game.addAlert(
                            'danger',
                            '{0} cancels the challenge redirect',
                            context.event.challenge.attackingPlayer
                        );
                    }
                });
            },
            limit: ability.limit.perRound(1)
        });
    }
}

CrownRegent.code = '01211';

module.exports = CrownRegent;
