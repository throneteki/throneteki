const DrawCard = require('../../drawcard.js');

class Pyke extends DrawCard {
    setupCardAbilities(ability) {
        this.persistentEffect({
            targetLocation: 'hand',
            match: card => card.isFaction('greyjoy') && card.hasTrait('Warship'),
            effect: ability.effects.gainAmbush(-1)
        });
        this.reaction({
            when: {
                onCardEntersPlay: event => event.card.controller === this.controller && event.card.isFaction('greyjoy') && event.card.getType() === 'location'
            },
            cost: ability.costs.kneelSelf(),
            target: {
                cardCondition: (card, context) => card.location === 'play area' && 
                    card !== context.event.card && 
                    card.getPrintedCost() <= context.event.card.getPrintedCost() &&
                    !card.isLimited() && 
                    !card.isLoyal()
            },
            handler: context => {
                context.target.owner.moveCardToTopOfDeck(context.target);
                this.game.addMessage('{0} kneels {1} to move {2} to the top of {3}\'s deck', context.player, this, context.target, context.target.owner);
                
                this.game.once('onAtEndOfPhase', () => {
                    if(!context.target.owner.canDraw()) {
                        return;
                    }

                    this.game.addMessage('Then {0} draws 1 card for {1}', context.target.owner, this);
                    context.target.owner.drawCardsToHand(1);
                });
            }
        });
    }
}

Pyke.code = '22006';

module.exports = Pyke;
