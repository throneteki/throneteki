const DrawCard = require('../../../drawcard.js');

class UnbowedUnbentUnbroken extends DrawCard {
    setupCardAbilities(ability) {
        this.reaction({
            max: ability.limit.perChallenge(1),
            when: {
                afterChallenge: (event, challenge) => (
                    !this.controller.firstPlayer &&
                    challenge.defendingPlayer === this.controller &&
                    challenge.loser === this.controller
                )
            },
            handler: () => {
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
        var otherPlayer = this.game.getOtherPlayer(player);

        if(!otherPlayer) {
            return true;
        }

        this.untilEndOfPhase(ability => ({
            targetType: 'player',
            targetController: 'opponent',
            effect: ability.effects.cannotInitiateChallengeType(challengeType)
        }));

        this.game.addMessage('{0} uses {1} to make {2} unable to initiate {3} challenges until the end of the phase', player, this, otherPlayer, challengeType);

        return true;
    }

    cancel(player) {
        this.game.addMessage('{0} cancel the resolution of {1}', player, this);

        this.game.addGold(player, this.getCost());
        player.moveCard(this, 'hand');

        return true;
    }
}

UnbowedUnbentUnbroken.code = '01120';

module.exports = UnbowedUnbentUnbroken;
