const DrawCard = require('../../drawcard.js');

class ScalingTheWall extends DrawCard {
    setupCardAbilities() {
        this.reaction({
            when: {
                afterChallenge: (event) =>
                    event.challenge.winner === this.controller && this.hasAttackingWildling()
            },
            target: {
                activePromptTitle: 'Select a location',
                cardCondition: (card, context) =>
                    card.location === 'play area' &&
                    card.getType() === 'location' &&
                    !card.isLimited() &&
                    card.controller === context.event.challenge.loser
            },
            handler: (context) => {
                this.game.addMessage(
                    "{0} plays {1} to return {2} to {3}'s hand",
                    context.player,
                    this,
                    context.target,
                    context.target.owner
                );
                context.target.owner.returnCardToHand(context.target);
            }
        });
    }

    hasAttackingWildling() {
        return this.controller.anyCardsInPlay(
            (card) =>
                card.isAttacking() && card.hasTrait('Wildling') && card.getType() === 'character'
        );
    }
}

ScalingTheWall.code = '07044';

module.exports = ScalingTheWall;
