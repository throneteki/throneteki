const DrawCard = require('../../drawcard.js');

class LordAndersHost extends DrawCard {
    setupCardAbilities(ability) {
        this.plotModifiers({
            initiative: 1
        });
        this.reaction({
            when: {
                onCardEntersPlay: (event, context) =>
                    this.game.isDuringChallenge() &&
                    this.game.currentPhase === 'challenge' &&
                    event.card.controller === context.player &&
                    (event.originalLocation === 'hand' || event.originalLocation === 'shadows')
            },
            limit: ability.limit.perRound(1),
            target: {
                cardCondition: (card, context) =>
                    card.getType() === 'character' &&
                    card.isParticipating() &&
                    card.getPrintedCost() < context.event.card.getPrintedCost()
            },
            handler: (context) => {
                context.target.owner.returnCardToHand(context.target);
                this.game.addMessage(
                    "{0} uses {1} to return {2} to {3}'s hand",
                    context.player,
                    this,
                    context.target,
                    context.target.owner
                );
            }
        });
    }
}

LordAndersHost.code = '21010';

module.exports = LordAndersHost;
