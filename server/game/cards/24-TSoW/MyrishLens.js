import DrawCard from '../../drawcard.js';
import GameActions from '../../GameActions/index.js';

class MyrishLens extends DrawCard {
    // The Myrish Eye (24006)
    // While there are no cards in shadows, attached character gains insight.
    // Reaction: After you win a challenge in which attached character is participating, kneel The
    // Myrish Eye to choose and reveal a card in shadows. If it is an event, discard it.
    setupCardAbilities(ability) {
        this.whileAttached({
            condition: (context) =>
                context.game.getPlayers().every((player) => player.shadows.length === 0),
            effect: ability.effects.addKeyword('insight')
        });
        this.reaction({
            when: {
                afterChallenge: (event, context) =>
                    event.challenge.winner === context.source.controller &&
                    context.source.parent.isParticipating()
            },
            cost: ability.costs.kneelSelf(),
            message: {
                format: "{player} kneels {source} to choose and reveal a card in {loser}'s shadows area",
                args: { loser: (context) => context.event.challenge.loser }
            },
            target: {
                activePromptTitle: 'Select a card',
                cardCondition: (card, context) =>
                    card.location === 'shadows' && card.controller === context.event.challenge.loser
            },
            gameAction: GameActions.revealCards((context) => ({
                cards: [context.target],
                player: context.player
            })).then({
                condition: (context) => context.parentContext.revealed[0].getType() === 'event',
                message: {
                    format: 'Then, {player} discards {card} from shadows',
                    args: { card: (context) => context.parentContext.revealed[0] }
                },
                gameAction: GameActions.discardCard((context) => ({
                    card: context.parentContext.revealed[0]
                }))
            })
        });
    }
}

MyrishLens.code = '24006';

export default MyrishLens;
