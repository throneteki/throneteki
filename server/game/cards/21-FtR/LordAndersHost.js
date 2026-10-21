import DrawCard from '../../drawcard.js';

class LordAndersHost extends DrawCard {
    // Lord Anders's Host (21010)
    // Ambush (8). Assault. No attachments.
    // Reaction: After a card enters play from your hand or shadows area during a challenge, choose
    // a participating character with a lower printed cost than that card's and return it to its
    // owner's hand. (Limit once per round.)
    // +1 Initiative
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

export default LordAndersHost;
