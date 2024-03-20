const DrawCard = require('../../drawcard');

class TasteTheBlood extends DrawCard {
    setupCardAbilities(ability) {
        this.reaction({
            when: {
                afterChallenge: event => event.challenge.winner === this.controller && event.challenge.challengeType === 'intrigue' && this.controller.anyCardsInPlay(card => card.getType() === 'character' && card.hasTrait('Old Gods') && card.isParticipating())
            },
            target: {
                activePromptTitle: 'Select a plot',
                cardCondition: card => card.location === 'revealed plots' && !card.notConsideredToBeInPlotDeck,
                cardType: 'plot'
            },
            cost: ability.costs.kneelFactionCard(),
            message: '{player} kneels their faction card and plays {source} to initiate the when revealed ability of {target}',
            handler: context => {
                let whenRevealed = context.target.getWhenRevealedAbility();
                if(whenRevealed) {
                    // Attach the current When Revealed event to the new context
                    let newContext = whenRevealed.createContext(context.event);
                    newContext.player = context.player;
                    this.game.resolveAbility(whenRevealed, newContext);
                }
            }
        });
    }
}

TasteTheBlood.code = '25032';

module.exports = TasteTheBlood;
