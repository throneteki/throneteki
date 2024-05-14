const DrawCard = require('../../drawcard.js');

class TasteForFlesh extends DrawCard {
    setupCardAbilities() {
        this.reaction({
            when: {
                afterChallenge: (event) =>
                    event.challenge.winner === this.controller &&
                    this.isAttackingDirewolfOrHasAttachment()
            },
            target: {
                cardCondition: (card) => card.isDefending(),
                gameAction: 'kill'
            },
            handler: (context) => {
                this.game.killCharacter(context.target);
                this.game.addMessage(
                    '{0} plays {1} to kill {2}',
                    context.player,
                    this,
                    context.target
                );
            }
        });
    }

    isAttackingDirewolfOrHasAttachment() {
        return this.controller.anyCardsInPlay(
            (card) =>
                card.isAttacking() &&
                (card.hasTrait('Direwolf') ||
                    card.attachments.some((attachment) => attachment.hasTrait('Direwolf')))
        );
    }
}

TasteForFlesh.code = '10034';

module.exports = TasteForFlesh;
