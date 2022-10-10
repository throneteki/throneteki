const DrawCard = require('../../drawcard.js');
const {Tokens} = require('../../Constants');

class TheWolfsDen extends DrawCard {
    setupCardAbilities(ability) {
        this.reaction({
            when: {
                'onSacrificed': event => event.card.getType() === 'character' && event.card.controller === this.controller,
                'onCharacterKilled': event => event.card.controller === this.controller
            },
            cost: ability.costs.kneelSelf(),
            message: '{player} kneels {source} to put the bottom card of their deck into shadow',
            handler: context => {
                let bottomCard = context.player.drawDeck.slice(-1)[0];
                context.player.putIntoShadows(bottomCard, false, () => {
                    bottomCard.modifyToken(Tokens.shadow, 1);

                    this.lastingEffect(ability => ({
                        condition: () => bottomCard.location === 'shadows',
                        targetLocation: 'any',
                        match: bottomCard,
                        effect: ability.effects.addKeyword(`Shadow (${bottomCard.getPrintedCost()})`)
                    }));
                });
            }
        });
    }
}

TheWolfsDen.code = '23012';

module.exports = TheWolfsDen;
