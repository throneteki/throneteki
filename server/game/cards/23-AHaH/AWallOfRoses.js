const DrawCard = require('../../drawcard.js');
const GameActions = require('../../GameActions/index.js');
const TextHelper = require('../../TextHelper');

class AWallOfRoses extends DrawCard {
    setupCardAbilities() {
        this.reaction({
            when: {
                onRemovedFromChallenge: event => event.card.getStrength() > 0
            },
            message: {
                format: '{player} uses {source} to stand up to {STR} characters',
                args: { STR: context => context.event.card.getStrength() }
            },
            handler: context => {
                this.game.promptForSelect(context.player, {
                    mode: 'upTo',
                    numCards: context.event.card.getStrength(),
                    activePromptTitle: `Select up to ${TextHelper.count(context.event.card.getStrength(), 'character')}`,
                    source: this,
                    cardCondition: { printedStrengthOrLower: 1, kneeled: true },
                    onSelect: (player, cards) => {
                        this.game.addMessage('{0} stands {1}', player, cards);
                        this.game.resolveGameAction(
                            GameActions.simultaneously(cards.map(card => GameActions.standCard({ card })))
                        , context);
                        return true;
                    }
                });
            } 
        });
    }
}

AWallOfRoses.code = '23016';

module.exports = AWallOfRoses;
