const DrawCard = require('../../drawcard.js');
const GameActions = require('../../GameActions');

class TheWardenOfTheWest extends DrawCard {
    setupCardAbilities(ability) {
        this.attachmentRestriction({ faction: 'lannister', trait: 'Lord' });

        this.whileAttached({
            effect: ability.effects.addTrait('Commander')
        });
        
        this.reaction({
            when: {
                // TODO: Implement player-aggregate so it only looks at cards being discarded from an individuals hands rather than aggregating all cards being discarded at once
                'onCardDiscarded:aggregate': event => this.getNumberToDraw(event) > 0 && this.allowGameAction('drawCards') && this.game.currentPhase === 'challenge'
            },
            limit: ability.limit.perRound(1),
            message: {
                format: '{player} uses {source} to draw {amount} cards',
                args: { amount: context => this.getNumberToDraw(context.event) }
            },
            gameAction: GameActions.drawCards(context => ({ player: context.player, amount: this.getNumberToDraw(context.event) }))
        });
    }

    getNumberToDraw(event) {
        return Math.min(event.events.filter(discardEvent => (
            discardEvent.cardStateWhenDiscarded.controller !== this.controller &&
            discardEvent.cardStateWhenDiscarded.location === 'hand'
        )).length, 3);
    }
}

TheWardenOfTheWest.code = '23006';

module.exports = TheWardenOfTheWest;
