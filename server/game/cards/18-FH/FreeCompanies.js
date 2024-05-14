const AgendaCard = require('../../agendacard.js');
const { Tokens } = require('../../Constants');

class FreeCompanies extends AgendaCard {
    setupCardAbilities(ability) {
        this.action({
            title: 'Place gold',
            cost: ability.costs.kneelFactionCard(),
            target: {
                cardCondition: (card) =>
                    card.location === 'play area' &&
                    (!card.hasToken(Tokens.gold) ||
                        (card.getType() === 'character' && card.hasTrait('Mercenary')))
            },
            handler: (context) => {
                this.game.addMessage(
                    '{0} uses {1} to kneel their faction card and have {2} gain 1 gold',
                    this.controller,
                    this,
                    context.target
                );
                context.target.modifyToken(Tokens.gold, 1);
            }
        });
        this.persistentEffect({
            match: (card) =>
                card.location === 'play area' &&
                card.getType() === 'character' &&
                card.isFaction('neutral') &&
                card.controller === this.controller &&
                !card.hasToken(Tokens.gold),
            targetController: 'current',
            effect: ability.effects.modifyStrength(-1)
        });
    }
}

FreeCompanies.code = '18019';

module.exports = FreeCompanies;
