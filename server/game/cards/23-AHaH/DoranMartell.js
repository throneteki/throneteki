const DrawCard = require('../../drawcard.js');
const GameActions = require('../../GameActions/index.js');

class DoranMartell extends DrawCard {
    setupCardAbilities(ability) {
        this.persistentEffect({
            targetLocation: 'shadows',
            effect: ability.effects.dynamicKeywords(card => [`Shadow (${card.getPrintedCost()})`])
        });

        this.reaction({
            when: {
                onDominanceDetermined: event => event.winner && this.controller !== event.winner
            },
            message: '{player} uses {source} to look at the top 2 cards of their deck',
            gameAction: GameActions.lookAtDeck(context => ({
                player: context.player,
                lookingAt: context.player,
                // TODO: Add 'whileLooking' option & select instead of choosing with 'then'
                amount: 2
            })).then({
                gameAction: GameActions.choose({
                    title: 'Select card to place in shadows',
                    message: '{choosingPlayer} places 1 card in shadows, and places the other on the bottom of their deck',
                    choices: context => this.buildChoices(context.event.topCards)
                })
            })
        });
    }

    buildChoices(topCards) {
        return topCards.reduce((choices, card) => {
            let actions = [GameActions.placeCard({ card, location: 'shadows' })];
            
            let otherCard = topCards.find(c => c !== card);
            if(otherCard) {
                actions.push(GameActions.placeCard({ card: otherCard, location: 'draw deck', bottom: true }));
            }

            choices[card.uuid] = { card, gameAction: GameActions.simultaneously(actions) };
            return choices;
        }, {});
    }
}

DoranMartell.code = '23007';

module.exports = DoranMartell;
