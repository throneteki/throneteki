const DrawCard = require('../../drawcard.js');

class Dragonstone extends DrawCard {
    setupCardAbilities(ability) {
        this.persistentEffect({
            match: this,
            effect: ability.effects.optionalStandDuringStanding()
        });
        this.reaction({
            when: {
                onCardPutIntoShadows: event => event.reason = 'ability'
            },
            message: {
                format: '{player} kneels {source} to prevent {card} from coming out of shadows until {source} stands or leaves play',
                args: { card: context => context.event.card }
            },
            cost: ability.costs.kneelSelf(),
            handler: context => {
                this.lastingEffect(ability => ({
                    until: {
                        onCardStood: event => event.card === this,
                        onCardLeftPlay: event => event.card === this,
                        onCardMoved: event => event.card === context.event.card
                    },
                    effect: ability.effects.cannotBringOutOfShadows(card => card === context.event.card)
                }));
            }
        });
    }
}

Dragonstone.code = '24003';

module.exports = Dragonstone;
