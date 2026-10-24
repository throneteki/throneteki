import DrawCard from '../../drawcard.js';
import GameActions from '../../GameActions/index.js';

class Dragonbinder extends DrawCard {
    // Dragonbinder (11052)
    // Character you control only.
    // Attached character gains intimidate.
    // Reaction: After you win dominance, kill attached character to, either: choose and take
    // control of a Dragon character, or search the top 10 cards of your deck for a [greyjoy]
    // character, put into play, and shuffle your deck.
    setupCardAbilities(ability) {
        this.attachmentRestriction({ controller: 'current' });
        this.whileAttached({
            effect: ability.effects.addKeyword('intimidate')
        });
        this.reaction({
            when: {
                onDominanceDetermined: (event, context) => context.player === event.winner
            },
            cost: ability.costs.killParent(),
            message:
                '{player} uses {source} and kills {costs.kill} to either take control of a Dragon character or search the top 10 cards of their deck for a Greyjoy character',
            gameAction: GameActions.choose({
                choices: {
                    'Take control of Dragon': {
                        condition: (context) =>
                            context.game
                                .getOpponents(context.player)
                                .some((player) =>
                                    player.anyCardsInPlay(
                                        (card) =>
                                            card.hasTrait('Dragon') &&
                                            card.getType() === 'character'
                                    )
                                ),
                        message: '{player} chooses to take control of a Dragon character',
                        gameAction: GameActions.chooseCards({
                            title: 'Select a Dragon character',
                            cardCondition: {
                                location: 'play area',
                                type: 'character',
                                trait: 'Dragon'
                            },
                            gameAction: (card, context) =>
                                GameActions.takeControl({ player: context.player, card, context })
                        })
                    },
                    'Put character into play': {
                        gameAction: GameActions.search({
                            title: 'Select a character',
                            topCards: 10,
                            match: { type: 'character', faction: 'greyjoy' },
                            reveal: false,
                            message: '{player} chooses to search their deck and {gameAction}',
                            gameAction: GameActions.putIntoPlay((context) => ({
                                card: context.searchTarget
                            }))
                        })
                    }
                }
            })
        });
    }
}

Dragonbinder.code = '11052';

export default Dragonbinder;
