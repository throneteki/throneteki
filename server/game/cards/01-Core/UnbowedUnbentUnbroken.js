const DrawCard = require('../../drawcard.js');

class UnbowedUnbentUnbroken extends DrawCard {
    setupCardAbilities(ability) {
        this.reaction({
            max: ability.limit.perChallenge(1),
            when: {
                afterChallenge: event => !this.controller.firstPlayer && event.challenge.defendingPlayer === this.controller &&
                                         event.challenge.loser === this.controller
            },
            handler: context => {
                this.challengeWinner = context.event.challenge.winner;
                this.game.promptWithMenu(this.controller, this, {
                    activePrompt: {
                        menuTitle: 'Select a challenge type',
                        buttons: [
                            { text: 'Military', method: 'trigger', arg: 'military' },
                            { text: 'Intrigue', method: 'trigger', arg: 'intrigue' },
                            { text: 'Power', method: 'trigger', arg: 'power' },
                            { text: 'Cancel', method: 'cancel' }
                        ]
                    },
                    source: this
                });
            }
        });
    }

    trigger(player, challengeType) {
        this.untilEndOfPhase(ability => ({
            targetType: 'player',
            targetController: this.challengeWinner,
            effect: ability.effects.cannotInitiateChallengeType(challengeType)
        }));

        this.game.addMessage('{0} plays {1} to make {2} unable to initiate {3} challenges until the end of the phase', player, this, this.challengeWinner, challengeType);

        return true;
    }

    cancel(player) {
        this.game.addMessage('{0} cancels the resolution of {1}', player, this);

        this.game.addGold(player, this.getCost());
        player.moveCard(this, 'hand');

        return true;
    }
}

UnbowedUnbentUnbroken.code = '01120';

module.exports = UnbowedUnbentUnbroken;
