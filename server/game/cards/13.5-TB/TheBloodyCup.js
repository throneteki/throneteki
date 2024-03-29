const DrawCard = require('../../drawcard');

class TheBloodyCup extends DrawCard {
    setupCardAbilities(ability) {
        this.reaction({
            when: {
                afterChallenge: event => event.challenge.isMatch({ winner: this.controller, unopposed: true })
            },
            target: {
                cardCondition: (card, context) => card.location === 'play area' && card.getType() === 'character' && card.controller === context.event.challenge.loser &&
                                                  card.allowGameAction('returnCardToDeck')
            },
            message: {
                format: '{player} plays {source} to place {target} on top of {loser}\'s deck',
                args: { loser: context => context.event.challenge.loser }
            },
            handler: context => {
                const loser = context.event.challenge.loser;
                loser.moveCardToTopOfDeck(context.target);
            },
            max: ability.limit.perChallenge(1)
        });
    }
}

TheBloodyCup.code = '13092';

module.exports = TheBloodyCup;
