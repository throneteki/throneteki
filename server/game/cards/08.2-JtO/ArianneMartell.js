import DrawCard from '../../drawcard.js';

class ArianneMartell extends DrawCard {
    setupCardAbilities(ability) {
        this.action({
            title: 'Return character to hand',
            phase: 'challenge',
            //TODO: This should ideally use the snapshot functionality instead
            condition: () => {
                this.strengthWhenInitiated = this.getStrength();
                return true;
            },
            cost: ability.costs.returnSelfToHand(),
            target: {
                cardCondition: (card) =>
                    card.location === 'play area' &&
                    card.getType() === 'character' &&
                    card.getStrength() < this.strengthWhenInitiated
            },
            handler: (context) => {
                context.target.owner.returnCardToHand(context.target);
                this.game.addMessage(
                    "{0} returns {1} to their hand to return {2} to {3}'s hand",
                    context.player,
                    this,
                    context.target,
                    context.target.owner
                );
            }
        });
    }
}

ArianneMartell.code = '08035';

export default ArianneMartell;
