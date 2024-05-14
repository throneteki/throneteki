const DrawCard = require('../../drawcard');

class VindictiveRanger extends DrawCard {
    setupCardAbilities() {
        this.reaction({
            when: {
                afterChallenge: (event) =>
                    event.challenge.isMatch({
                        loser: this.controller,
                        defendingPlayer: this.controller
                    })
            },
            handler: (context) => {
                this.game.promptForIcon(context.player, this, (icon) => {
                    this.game.addMessage(
                        '{0} uses {1} to gain stealth and {2} {3} icon',
                        context.player,
                        this,
                        icon === 'intrigue' ? 'an' : 'a',
                        icon
                    );
                    this.untilEndOfPhase((ability) => ({
                        match: this,
                        effect: [
                            ability.effects.addIcon(icon),
                            ability.effects.addKeyword('Stealth')
                        ]
                    }));
                });
            }
        });
    }
}

VindictiveRanger.code = '12031';

module.exports = VindictiveRanger;
