const DrawCard = require('../../drawcard.js');

class Heartsbane extends DrawCard {
    setupCardAbilities(ability) {
        this.attachmentRestriction({ faction: 'tyrell' });
        this.action({
            title: 'Give attached character +3 STR',
            condition: () => this.parent && this.parent.isParticipating(),
            cost: ability.costs.kneelSelf(),
            handler: () => {
                this.untilEndOfChallenge((ability) => ({
                    match: this.parent,
                    effect: ability.effects.modifyStrength(3)
                }));
                this.game.addMessage(
                    '{0} kneels {1} to give {2} +3 STR until the end of the challenge',
                    this.controller,
                    this,
                    this.parent
                );
            }
        });
    }
}

Heartsbane.code = '01191';

module.exports = Heartsbane;
