const GameActions = require('../../GameActions/index.js');
const DrawCard = require('../../drawcard.js');

class MargaeryTyrell extends DrawCard {
    setupCardAbilities(ability) {
        this.interrupt({
            when: {
                // TODO: Probably refine onCardsRevealed; it is clunky where it's the cards visible before onCardRevealed (singular) interrupt, but after onCardsRevealed (multiple). Aggregate is a workaround
                'onCardRevealed:aggregate': event => this.getValidRevealEvents(event.events).length > 0
            },
            limit: ability.limit.perRound(2),
            target: {
                activePromptTitle: 'Select a card',
                cardCondition: (card, context) => this.getValidRevealEvents(context.event.events).some(event => event.card === card)
            },
            message: {
                format: '{player} uses {source} to place {card} in shadows',
                args: { card: context => context.event.card }
            },
            handler: context => {
                this.game.resolveGameAction(GameActions.placeCard(context => ({ card: context.target, location: 'shadows' })), context);
            }
            
        });
    }

    getValidRevealEvents(events) {
        return events.filter(event => event.card.isFaction('tyrell') && event.card.controller === this.controller && ['hand', 'draw deck'].includes(event.card.location));
    }
}

MargaeryTyrell.code = '25585';
MargaeryTyrell.version = '1.3';

module.exports = MargaeryTyrell;
