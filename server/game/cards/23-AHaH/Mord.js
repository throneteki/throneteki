const DrawCard = require('../../drawcard');
const Message = require('../../Message');

class Mord extends DrawCard {
    setupCardAbilities(ability) {
        this.action({
            title: 'Kneel to blank card',
            cost: ability.costs.kneelSelf(),
            target: {
                cardCondition: card => card.isMatch({ location: 'play area', type: 'character' }) || card.isMatch({ location: 'shadows' })
            },
            message: {
                format: '{player} kneels {source} to treat the text box of {card} as blank until {source} stands or leaves play',
                args: { card: context => this.getCardOrPosition(context.target) }
            },
            handler: context => {
                this.lastingEffect(ability => ({
                    until: {
                        onCardStood: event => event.card === this,
                        onCardLeftPlay: event => event.card === this || event.card === context.target
                    },
                    targetLocation: 'any',
                    match: context.target,
                    effect: ability.effects.blankExcludingTraits
                }));
            }
        });
    }

    getCardOrPosition(card) {
        if(card.location === 'shadows') {
            const position = card.controller.shadows.indexOf(card) + 1;
            return Message.fragment('card #{position} in {player}\'s shadow area', {
                position,
                player: card.controller
            });
        }
        return Message.fragment('{card}', { card });
    }
}

Mord.code = '23023';

module.exports = Mord;
