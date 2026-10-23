import DrawCard from '../../drawcard.js';
import GameActions from '../../GameActions/index.js';

class EuronCrowsEye extends DrawCard {
    // Euron Crow's Eye (17103)
    // While you control another Raider character, Euron Crow's Eye gains intimidate.
    // Reaction: After Euron Crow's Eye enters play, either: put a Warship location into play from
    // your hand, or search your deck for Silence, reveal it, add it to your hand, and shuffle your
    // deck.
    setupCardAbilities(ability) {
        this.persistentEffect({
            condition: (context) =>
                context.source.controller.anyCardsInPlay(
                    (card) =>
                        card.getType() === 'character' &&
                        card.hasTrait('Raider') &&
                        card !== context.source
                ),
            match: (card, context) => card === context.source,
            effect: ability.effects.addKeyword('intimidate')
        });
        this.reaction({
            when: {
                onCardEntersPlay: (event, context) => event.card === context.source
            },
            message:
                '{player} uses {source} to either put a Warship location into play, or search for Silence',
            choices: {
                'Put Warship into play': {
                    message: '{player} chooses to put a Warship location into play from their hand',
                    gameAction: GameActions.chooseCards({
                        title: 'Select a Warship location',
                        cardCondition: (card, context) =>
                            card.location === 'hand' &&
                            card.controller === context.player &&
                            card.getType() === 'location' &&
                            card.hasTrait('Warship'),
                        gameAction: (card, context) =>
                            GameActions.putIntoPlay({ card, player: context.player })
                    })
                },
                'Search for Silence': {
                    gameAction: GameActions.search({
                        title: 'Select a card',
                        match: { name: 'Silence' },
                        message: '{player} chooses to search their deck, and {gameAction}',
                        gameAction: GameActions.addToHand((context) => ({
                            card: context.searchTarget
                        }))
                    })
                }
            }
        });
    }
}

EuronCrowsEye.code = '17103';

export default EuronCrowsEye;
