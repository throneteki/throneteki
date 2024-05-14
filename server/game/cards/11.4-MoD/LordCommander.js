const DrawCard = require('../../drawcard.js');

class LordCommander extends DrawCard {
    setupCardAbilities() {
        this.attachmentRestriction({ faction: 'thenightswatch', printedCostOrHigher: 5 });
        this.reaction({
            when: {
                afterChallenge: (event) =>
                    event.challenge.winner === this.controller && this.hasParticipatingNWCharacter()
            },
            handler: (context) => {
                this.parent.modifyPower(1);
                this.game.addMessage(
                    '{0} uses {1} to gain 1 power on {2}',
                    context.player,
                    this,
                    this.parent
                );
            }
        });
    }

    hasParticipatingNWCharacter() {
        return this.controller.anyCardsInPlay(
            (card) => card.isParticipating() && card.isFaction('thenightswatch')
        );
    }
}

LordCommander.code = '11066';

module.exports = LordCommander;
