import AgendaCard from '../../agendacard.js';
import { flatten } from '../../../Array.js';
import GameActions from '../../GameActions/index.js';

class TheManyFacedGod extends AgendaCard {
    // The Many-Faced God (20052)
    // Your plot deck cannot include Kingdom plot cards.
    // Reduce the cost of the first card you ambush each round by 1.
    // Action: Kneel your faction card to choose a character you control and a player. Until the end
    // of the phase, that character gains each of the printed challenge icons, keywords, faction
    // affiliations, and Traits of the top character in that player's dead pile.
    setupCardAbilities(ability) {
        this.persistentEffect({
            targetController: 'current',
            effect: ability.effects.reduceFirstCardCostEachRound('ambush', 1)
        });
        this.action({
            title: 'Give icons, affiliation, keywords and traits',
            cost: ability.costs.kneelFactionCard(),
            target: {
                cardCondition: (card, context) =>
                    card.location === 'play area' &&
                    card.getType() === 'character' &&
                    card.controller === context.player
            },
            choosePlayer: (player) => player.deadPile.length > 0,
            message: {
                format: "{player} uses {source} and kneels their faction card to have {target} gain each of {character}'s printed challenge icons, keywords, faction affiliations and traits until the end of the phase",
                args: { character: (context) => topDeadCharacter(context) }
            },
            gameAction: GameActions.lastingEffect((context) => {
                const character = topDeadCharacter(context);
                return {
                    duration: 'untilEndOfPhase',
                    match: context.target,
                    effect: flatten([
                        character.getIcons().map((icon) => ability.effects.addIcon(icon)),
                        character
                            .getPrintedKeywords()
                            .map((keyword) => ability.effects.addKeyword(keyword)),
                        character
                            .getFactions()
                            .map((faction) => ability.effects.addFaction(faction)),
                        character.getTraits().map((trait) => ability.effects.addTrait(trait))
                    ])
                };
            })
        });
    }
}

function topDeadCharacter(context) {
    return (context.chosenPlayer || context.player).deadPile.slice(-1)[0];
}

TheManyFacedGod.code = '20052';

export default TheManyFacedGod;
