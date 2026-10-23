import AgendaCard from '../../agendacard.js';
import GameActions from '../../GameActions/index.js';
import { Flags } from '../../Constants/index.js';

class TheRainsOfCastamere extends AgendaCard {
    // "The Rains of Castamere" (05045)
    // Your plot deck must be 12 cards, including exactly 5 different Scheme cards. During the plot
    // phase, Scheme cards are not considered to be in your plot deck.
    // Reaction: After you win an [intrigue] challenge by 5 or more STR, kneel your faction card to
    // reveal a Scheme plot. If that card leaves play, remove it from the game.
    setupCardAbilities(ability) {
        this.reaction({
            when: {
                afterChallenge: (event, context) =>
                    event.challenge.challengeType === 'intrigue' &&
                    event.challenge.winner === context.player &&
                    event.challenge.strengthDifference >= 5 &&
                    !context.player.hasFlag(Flags.player.cannotRevealPlot)
            },
            cost: ability.costs.kneelFactionCard(),
            target: {
                type: 'select',
                activePromptTitle: 'Select a plot',
                cardCondition: (card, context) =>
                    card.controller === context.player &&
                    card.hasTrait('Scheme') &&
                    card.location === 'plot deck',
                cardType: 'plot'
            },
            message: '{player} uses {source} and kneels their faction card to reveal {target}',
            gameAction: GameActions.simultaneously([
                GameActions.revealNewPlot((context) => ({
                    card: context.target,
                    player: context.player
                })),
                GameActions.delayedEffect({
                    duration: 'untilTriggered',
                    when: {
                        onCardLeftPlay: (event, context) => event.card === context.target
                    },
                    message: '{player} removes {target} from the game as it left play',
                    gameAction: GameActions.removeFromGame((context) => ({
                        card: context.target
                    }))
                })
            ])
        });

        this.persistentEffect({
            condition: (context) => context.game.currentPhase === 'plot',
            match: (card) => card.getType() === 'plot' && card.hasTrait('Scheme'),
            targetController: 'current',
            targetLocation: 'plot deck',
            effect: ability.effects.notConsideredToBeInPlotDeck()
        });

        this.persistentEffect({
            match: (card) => card.getType() === 'plot' && card.hasTrait('Scheme'),
            targetController: 'current',
            targetLocation: 'plot deck',
            effect: ability.effects.notConsideredWhenRecyclingPlots()
        });
    }
}

TheRainsOfCastamere.code = '05045';

export default TheRainsOfCastamere;
