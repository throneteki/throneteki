const DrawCard = require('../../drawcard.js');
const GameActions = require('../../GameActions');

class OrtonMerryweather extends DrawCard {
    setupCardAbilities(ability) {
        this.reaction({
            when: {
                onCardEntersPlay: (event) =>
                    event.card.hasTrait('Small Council') && event.playingType === 'marshal',
                onCardPlayed: (event) => event.card.hasTrait('Small Council')
            },
            limit: ability.limit.perPhase(1),
            target: {
                activePromptTitle: 'Select an event',
                cardCondition: (card, context) =>
                    card.location === 'discard pile' &&
                    card.controller === context.player &&
                    card.getType() === 'event'
            },
            handler: (context) => {
                context.player.moveCard(context.target, 'hand');
                this.game.addMessage(
                    '{0} uses {1} to return {2} from their discard pile to their hand',
                    context.player,
                    this,
                    context.target
                );
            }
        });

        this.interrupt({
            when: {
                onCardLeftPlay: (event) => event.card === this
            },
            target: {
                cardCondition: (card) =>
                    card.controller === this.controller &&
                    card.location === 'hand' &&
                    card.getType() === 'character' &&
                    card.hasTrait('Spy') &&
                    !card.isUnique() &&
                    this.controller.canPutIntoPlay(card)
            },
            message: '{player} uses {source} to put {target} into play',
            handler: (context) => {
                this.game.resolveGameAction(
                    GameActions.putIntoPlay((context) => ({
                        card: context.target,
                        player: context.player
                    })),
                    context
                );
            }
        });
    }
}

OrtonMerryweather.code = '18015';

module.exports = OrtonMerryweather;
