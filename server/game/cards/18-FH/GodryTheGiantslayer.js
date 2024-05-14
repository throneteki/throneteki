const DrawCard = require('../../drawcard.js');
const { Tokens } = require('../../Constants');

class GodryTheGiantslayer extends DrawCard {
    setupCardAbilities(ability) {
        this.persistentEffect({
            match: this,
            effect: ability.effects.dynamicStrength(() => this.tokens[Tokens.gold])
        });
        this.persistentEffect({
            condition: () => this.tokens[Tokens.gold] >= 5,
            match: this,
            effect: ability.effects.addKeyword('Intimidate')
        });
        this.reaction({
            when: {
                onCardEntersPlay: (event) =>
                    event.playingType === 'marshal' &&
                    event.card !== this &&
                    event.card.controller === this.controller &&
                    (event.card.hasTrait("R'hllor") || event.card.hasTrait('Knight')),
                onCardPlayed: (event) =>
                    event.card.controller === this.controller && event.card.hasTrait("R'hllor")
            },
            limit: ability.limit.perPhase(1),
            handler: () => {
                this.modifyToken(Tokens.gold, 1);
                this.game.addMessage('{0} uses {1} to have {1} gain 1 gold', this.controller, this);
            }
        });
    }
}

GodryTheGiantslayer.code = '18002';

module.exports = GodryTheGiantslayer;
