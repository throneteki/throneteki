import AgendaCard from '../../agendacard.js';
import GameActions from '../../GameActions/index.js';
import { Tokens } from '../../Constants/index.js';

class FreeCompanies extends AgendaCard {
    // Free Companies (18019)
    // Each neutral character you control gets -1 STR if it has no gold.
    // Action: Kneel your faction card to place 1 gold from the treasury on, either: a card without
    // gold, or a Mercenary character.
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
            message:
                '{player} uses {source} to kneel their faction card and have {target} gain 1 gold',
            gameAction: GameActions.placeToken((context) => ({
                card: context.target,
                token: Tokens.gold,
                amount: 1
            }))
        });
        this.persistentEffect({
            match: (card, context) =>
                card.location === 'play area' &&
                card.getType() === 'character' &&
                card.isFaction('neutral') &&
                card.controller === context.source.controller &&
                !card.hasToken(Tokens.gold),
            targetController: 'current',
            effect: ability.effects.modifyStrength(-1)
        });
    }
}

FreeCompanies.code = '18019';

export default FreeCompanies;
