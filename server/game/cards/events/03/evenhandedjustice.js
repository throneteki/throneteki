const _ = require('underscore');

const DrawCard = require('../../../drawcard.js');

class EvenHandedJustice extends DrawCard {
    setupCardAbilities() {
        this.action({
            title: 'Kneel a character for each player',
            targets: {
                yourCard: {
                    activePromptTitle: 'Select a standing character of yours',
                    cardCondition: card =>
                        !card.kneeled
                        && card.location === 'play area'
                        && card.getType() === 'character'
                        && card.controller === this.controller, // event controller
                    gameAction: 'kneel'
                },
                opponentCard: {
                    activePromptTitle: 'Select a standing character controlled by your opponent',
                    cardCondition: card =>
                        !card.kneeled
                        && card.location === 'play area'
                        && card.getType() === 'character'
                        && card.controller !== this.controller, // not event controller
                    gameAction: 'kneel'
                }
            },
            handler: context => {
                let kneeledCards = [context.targets.yourCard, context.targets.opponentCard];

                _.each(kneeledCards, card => card.controller.kneelCard(card));
                this.game.addMessage('{0} uses {1} to kneel {2}',
                    this.controller, this, kneeledCards);
            }
        });
    }
}

EvenHandedJustice.code = '03026';

module.exports = EvenHandedJustice;
