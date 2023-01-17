const DrawCard = require('../../drawcard.js');
const GameActions = require('../../GameActions');

class Dragonbinder extends DrawCard {
    setupCardAbilities(ability) {
        this.attachmentRestriction({ controller: 'current' });
        this.whileAttached({
            effect: ability.effects.addKeyword('intimidate')
        });
        this.reaction({
            when: {
                onDominanceDetermined: event => this.controller === event.winner
            },
            cost: ability.costs.killParent(),
            message: '{player} uses {source} and kills {costs.kill} to either take control of a Dragon character or search the top 10 cards of their deck for a Greyjoy character',
            gameAction: GameActions.choose({
                choices: {
                    'Take control of Dragon': {
                        condition: () => this.anyOpponentHasDragon(),
                        gameAction: GameActions.genericHandler(context => {
                            this.game.promptForSelect(this.controller, {
                                source: this,
                                cardCondition: { location: 'play area', type: 'character', trait: 'Dragon' },
                                onSelect: (player, card) => {
                                    this.game.addMessage('{0} chooses to take control of {1}\'s {2}', player, card.controller, card);
                                    this.game.resolveGameAction(GameActions.takeControl({
                                        player, card, context
                                    }), context);
                                    return true;
                                },
                                onCancel: (player) => {
                                    this.game.addAlert('danger', '{0} does not choose a Dragon character', player);
                                    return true;
                                }
                            });
                        })
                    },
                    'Put character into play': {
                        gameAction: GameActions.search({
                            title: 'Select a character',
                            topCards: 10,
                            match: { type: 'character', faction: 'greyjoy' },
                            reveal: false,
                            message: '{player} chooses to search their deck and {gameAction}',
                            gameAction: GameActions.putIntoPlay(context => ({
                                card: context.searchTarget
                            }))
                        })
                    }
                }
            })
        });
    }

    anyOpponentHasDragon() {
        return this.game.getOpponents(this.controller).some(player => player.anyCardsInPlay(card => card.hasTrait('Dragon') && card.getType() === 'character'));
    }
}

Dragonbinder.code = '11052';

module.exports = Dragonbinder;
