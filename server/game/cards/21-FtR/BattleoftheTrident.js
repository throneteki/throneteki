import AgendaCard from '../../agendacard.js';
import GameActions from '../../GameActions/index.js';
import { Flags } from '../../Constants/index.js';

const PlotTraits = { military: 'War', intrigue: 'Edict', power: 'Siege' };

class BattleoftheTrident extends AgendaCard {
    // Battle of the Trident (21030)
    // Your plot deck must be exactly 10 Edict, Siege, or War cards.
    // Reaction: After claim is applied for a challenge in which you control an attacking Army or
    // Commander character, kneel your faction card to reveal:
    // - a War plot if it is a [military] challenge.
    // - an Edict plot if it is an [intrigue] challenge.
    // - a Siege plot if it is a [power] challenge.
    // Then, choose a plot card in your used pile. Remove that card from the game until you have
    // exactly 1 card in your plot deck.
    setupCardAbilities(ability) {
        this.reaction({
            when: {
                onClaimApplied: (event, context) =>
                    !!event.challenge &&
                    event.challenge.attackers.some(
                        (attacker) =>
                            attacker.controller === context.player &&
                            (attacker.hasTrait('Army') || attacker.hasTrait('Commander'))
                    ) &&
                    !context.player.hasFlag(Flags.player.cannotRevealPlot)
            },
            cost: ability.costs.kneelFactionCard(),
            target: {
                type: 'select',
                activePromptTitle: 'Select a plot',
                cardCondition: (card, context) =>
                    card.controller === context.player &&
                    card.location === 'plot deck' &&
                    card.hasTrait(PlotTraits[context.event.challenge.challengeType]),
                cardType: 'plot'
            },
            message: '{player} uses {source} and kneels their faction card to reveal {target}',
            gameAction: GameActions.revealNewPlot((context) => ({
                card: context.target,
                player: context.player
            })).then({
                gameAction: GameActions.chooseCards({
                    title: 'Select a plot',
                    cardCondition: (card, context) =>
                        card.getType() === 'plot' &&
                        card.location === 'revealed plots' &&
                        card.controller === context.player,
                    gameAction: (card, context) =>
                        GameActions.lastingEffect(() => ({
                            duration: 'custom',
                            condition: () => context.player.getPlots().length !== 1,
                            match: card,
                            targetLocation: ['revealed plots', 'out of game'],
                            effect: ability.effects.removeFromGame()
                        }))
                })
            })
        });
    }
}

BattleoftheTrident.code = '21030';

export default BattleoftheTrident;
