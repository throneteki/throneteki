const AgendaCard = require('../../agendacard');
const { flatten } = require('../../../Array');

class TheManyFacedGod extends AgendaCard {
    setupCardAbilities(ability) {
        this.persistentEffect({
            targetController: 'current',
            effect: ability.effects.reduceFirstCardCostEachRound('ambush', 1)
        });

        this.action({
            title: 'Give icons, affiliation, keywords and traits',
            cost: ability.costs.kneelFactionCard(),
            target: {
                cardCondition: (card) =>
                    card.location === 'play area' &&
                    card.getType() === 'character' &&
                    card.controller === this.controller
            },
            choosePlayer: (player) => player.deadPile.length > 0,
            handler: (context) => {
                let chosenPlayer = context.chosenPlayer ? context.chosenPlayer : context.player;
                let topDeadCharacter = chosenPlayer.deadPile.slice(-1)[0];
                let effectArr = flatten([
                    topDeadCharacter.getIcons().map((icon) => ability.effects.addIcon(icon)),
                    topDeadCharacter
                        .getPrintedKeywords()
                        .map((keyword) => ability.effects.addKeyword(keyword)),
                    topDeadCharacter
                        .getFactions()
                        .map((faction) => ability.effects.addFaction(faction)),
                    topDeadCharacter.getTraits().map((trait) => ability.effects.addTrait(trait))
                ]);

                this.untilEndOfPhase(() => ({
                    match: context.target,
                    effect: effectArr
                }));

                this.game.addMessage(
                    "{0} uses {1} and kneels their faction card to have {2} gain each of {3}'s printed challenge icons, keywords, faction affiliations and traits",
                    context.player,
                    this,
                    context.target,
                    topDeadCharacter
                );
            }
        });
    }
}

TheManyFacedGod.code = '20052';

module.exports = TheManyFacedGod;
