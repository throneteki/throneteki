const DrawCard = require('../../drawcard.js');

class TheCrowIsATricksyBird extends DrawCard {
    setupCardAbilities(ability) {
        this.action({
            title: 'Look at plot deck',
            phase: 'plot',
            chooseOpponent: () => true,
            cost: ability.costs.kneelFactionCard(),
            handler: context => {
                this.context = context;
                this.game.addMessage('{0} plays {1} and kneels their faction card to look at {2}\'s plot deck',
                    context.player, this, context.opponent);
                
                let buttons = context.opponent.plotDeck.map(card => {
                    return { method: 'cardSelected', card: card };
                });

                this.game.promptWithMenu(context.player, this, {
                    activePrompt: {
                        menuTitle: 'Select a plot',
                        buttons: buttons
                    },
                    source: this
                });
            }
        });
    }

    cardSelected(player, cardId) {
        let card = this.context.opponent.findCardByUuid(this.context.opponent.plotDeck, cardId);

        if(!card) {
            return false;
        }

        this.lastingEffect(ability => ({
            until: {
                onCardEntersPlay: event => event.card.getType() === 'plot' && event.card.controller === this.context.opponent
            },
            targetType: player,
            match: this.context.opponent,
            effect: ability.effects.mustRevealPlot(card)
        }));
 
        //TODO Melee: The choice should not be revealed to anyone other than the chosen opponent, 
        //so this message, as well as the announcement message in the plot phase will have to be whispered.
        this.game.addMessage('{0} uses {1} to force {2} to reveal {3} the next time they reveal a plot, if able',
            player, this, this.context.opponent, card);

        return true;
    }
}

TheCrowIsATricksyBird.code = '08106';

module.exports = TheCrowIsATricksyBird;
