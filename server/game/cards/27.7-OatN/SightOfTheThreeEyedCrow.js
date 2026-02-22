import AgendaCard from '../../agendacard.js';
import GameActions from '../../GameActions/index.js';

class SightOfTheThreeEyedCrow extends AgendaCard {
    setupCardAbilities(ability) {
        this.reaction({
            when: {
                onCardEntersPlay: (event, context) => context.player == event.card.controller,
                onCardPlayed: (event, context) => context.player == event.player
            },
            gameAction: GameActions.search({
                title: 'Select a card',
                match: {
                    condition: (card, context) =>
                        card.getType() === context.event.card.getType() &&
                        card.getPrintedCost() === context.event.card.getPrintedCost()
                },
                message: '{player} {gameAction}',
                gameAction: GameActions.addToHand((context) => ({
                    card: context.searchTarget
                }))
            }),
            limit: ability.limit.perRound(1)
        });
    }
}

SightOfTheThreeEyedCrow.code = '27618';
SightOfTheThreeEyedCrow.version = '1.0.0';

export default SightOfTheThreeEyedCrow;
