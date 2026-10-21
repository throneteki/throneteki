import DrawCard from '../../drawcard.js';
import { Tokens } from '../../Constants/index.js';

class GodryTheGiantslayer extends DrawCard {
    // Godry the Giantslayer (18002)
    // Bestow (1).
    // X is the number of gold Godry the Giantslayer has. While he has 5 or more gold, he gains
    // intimidate.
    // Reaction: After you marshal or play another Knight or R'hllor card, Godry the Giantslayer
    // gains 1 gold. (Limit once per phase.)
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

export default GodryTheGiantslayer;
