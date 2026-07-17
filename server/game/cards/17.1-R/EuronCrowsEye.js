import DrawCard from '../../drawcard.js';
import GameActions from '../../GameActions/index.js';

class EuronCrowsEye extends DrawCard {
    setupCardAbilities(ability) {
        this.persistentEffect({
            condition: () => this.hasAnotherRaider(),
            match: this,
            effect: ability.effects.addKeyword('intimidate')
        });
        this.reaction({
            when: {
                onCardEntersPlay: (event) => event.card === this
            },
            message:
                '{player} uses {source} to either put a Warship location into play, or search for Silence',
            choices: {
                'Put Warship into play': {
                    condition: (context) =>
                        context.player.hand.some((card) => this.isValidWarship(card)),
                    gameAction: GameActions.genericHandler((context) => {
                        this.game.promptForSelect(context.player, {
                            cardCondition: (card) =>
                                card.location === 'hand' &&
                                context.player === card.controller &&
                                this.isValidWarship(card),
                            source: this,
                            onSelect: (player, card) => this.warshipSelected(player, card)
                        });
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

    isValidWarship(card) {
        return (
            card.getType() === 'location' &&
            card.hasTrait('Warship') &&
            this.controller.canPutIntoPlay(card)
        );
    }

    warshipSelected(player, card) {
        this.game.addMessage('{0} chooses to put {1} into play from their hand', player, card);
        this.game.resolveGameAction(GameActions.putIntoPlay({ card }));
        return true;
    }

    hasAnotherRaider() {
        let cards = this.controller.filterCardsInPlay(
            (card) => card.getType() === 'character' && card.hasTrait('Raider') && card !== this
        );
        return cards.length > 0;
    }
}

EuronCrowsEye.code = '17103';

export default EuronCrowsEye;
