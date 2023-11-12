const GameActions = require('../../GameActions/index.js');
const DrawCard = require('../../drawcard.js');

class Winterfell extends DrawCard {
    setupCardAbilities(ability) {
        this.plotModifiers({
            initiative: -2
        });
        this.reaction({
            when: {
                onCardDiscarded: event => event.isPillage && event.source.controller === this.controller && event.card.getType() === 'character'
            },
            cost: [
                ability.costs.kneelSelf(),
                ability.costs.sacrificeSelf()
            ],
            message: {
                format: '{player} kneels and sacrifices {costs.kneel} to put {card} into play under their control',
                args: { card: context => context.event.card }
            },
            gameAction: GameActions.putIntoPlay(context => ({
                player: context.player,
                card: context.event.card
            })).thenExecute(event => {
                this.atEndOfPhase(ability => ({
                    match: event.card,
                    condition: () => ['play area', 'duplicate'].includes(event.card.location),
                    targetLocation: 'any',
                    effect: ability.effects.discardIfStillInPlay(false)
                }));
            })
        });
    }
}

Winterfell.code = '25520';
Winterfell.version = '1.1';

module.exports = Winterfell;
