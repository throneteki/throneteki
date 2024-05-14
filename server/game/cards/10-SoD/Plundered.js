const DrawCard = require('../../drawcard.js');

class Plundered extends DrawCard {
    setupCardAbilities() {
        this.attachmentRestriction({ type: 'location', controller: 'opponent' });
        this.reaction({
            when: {
                afterChallenge: (event) =>
                    event.challenge.loser === this.parent.controller &&
                    event.challenge.defendingPlayer === this.parent.controller &&
                    !this.parent.kneeled
            },
            handler: (context) => {
                this.parent.controller.kneelCard(this.parent);
                this.game.addMessage(
                    '{0} uses {1} to kneel {2}',
                    context.player,
                    this,
                    this.parent
                );

                if (!context.player.canGainGold()) {
                    return true;
                }

                this.game.promptWithMenu(context.player, this, {
                    activePrompt: {
                        menuTitle: 'Sacrifice Plundered to gain 3 gold?',
                        buttons: [
                            { text: 'Yes', method: 'sacrifice' },
                            { text: 'No', method: 'decline' }
                        ]
                    },
                    source: this
                });
            }
        });
    }

    sacrifice() {
        this.controller.sacrificeCard(this);
        let gold = this.game.addGold(this.controller, 3);
        this.game.addMessage(
            '{0} then sacrifices {1} to gain {2} gold',
            this.controller,
            this,
            gold
        );
        return true;
    }

    decline() {
        return true;
    }
}

Plundered.code = '10028';

module.exports = Plundered;
