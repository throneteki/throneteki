import DrawCard from '../../drawcard.js';
import GameActions from '../../GameActions/index.js';

class TheSongOfTheSeven extends DrawCard {
    // "The Song of the Seven" (08098)
    // Reaction: After you lose dominance, move 2 power from the winning opponent's faction card to
    // a The Seven character you control. (Max 1 per phase.)
    setupCardAbilities(ability) {
        this.reaction({
            max: ability.limit.perRound(1),
            when: {
                onDominanceDetermined: (event, context) =>
                    event.winner &&
                    context.source.controller !== event.winner &&
                    event.winner.faction.power >= 1
            },
            target: {
                cardCondition: (card, context) =>
                    card.location === 'play area' &&
                    card.controller === context.source.controller &&
                    card.getType() === 'character' &&
                    card.hasTrait('The Seven')
            },
            message: {
                format: "{player} plays {source} to move power from {otherPlayer}'s faction to {target}",
                args: {
                    otherPlayer: (context) => context.event.winner
                }
            },
            gameAction: GameActions.movePower((context) => ({
                from: context.event.winner.faction,
                to: context.target,
                amount: Math.min(context.event.winner.faction.power, 2)
            }))
        });
    }
}

TheSongOfTheSeven.code = '08098';

export default TheSongOfTheSeven;
