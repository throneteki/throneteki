import DrawCard from '../../drawcard.js';

class PayTheIronPrice extends DrawCard {
    setupCardAbilities(ability) {
        this.action({
            title: 'Put attachment into play',
            phase: 'challenge',
            target: {
                activePromptTitle: 'Select an attachment',
                cardCondition: (card) =>
                    card.location === 'discard pile' &&
                    card.controller !== this.controller &&
                    card.getType() === 'attachment'
            },
            handler: (context) => {
                this.controller.putIntoPlay(context.target);
                this.game.addMessage(
                    "{0} plays {1} to put {2} into play from {3}'s discard pile under their control",
                    this.controller,
                    this,
                    context.target,
                    context.target.owner
                );
            }
        });

        this.reaction({
            location: 'discard pile',
            when: {
                afterChallenge: (event) =>
                    this.controller === event.challenge.winner && event.challenge.isUnopposed()
            },
            ignoreEventCosts: true,
            cost: ability.costs.payGold(1),
            handler: () => {
                this.game.addMessage(
                    '{0} pays 1 gold to move {1} back to their hand',
                    this.controller,
                    this
                );
                this.controller.moveCard(this, 'hand');
            }
        });
    }
}

PayTheIronPrice.code = '06112';

export default PayTheIronPrice;
