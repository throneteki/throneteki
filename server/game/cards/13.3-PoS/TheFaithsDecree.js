const DrawCard = require('../../drawcard');

class TheFaithsDecree extends DrawCard {
    setupCardAbilities() {
        this.action({
            title: 'Prevent abilities',
            condition: (context) =>
                context.player.anyCardsInPlay({
                    type: ['character', 'location'],
                    trait: 'The Seven'
                }),
            handler: (context) => {
                this.game.promptForCardName({
                    player: context.player,
                    match: (cardData) => !['agenda', 'plot'].includes(cardData.type),
                    onSelect: (player, cardName) => this.selectCardName(player, cardName),
                    source: this
                });
            }
        });
    }

    selectCardName(player, cardName) {
        this.game.addMessage(
            '{0} plays {1} to prevent opponents from triggering {2}',
            player,
            this,
            cardName
        );
        this.untilEndOfPhase((ability) => ({
            targetController: 'opponent',
            effect: ability.effects.cannotTriggerCardAbilities(
                (ability) => ability.card.name === cardName
            )
        }));
    }
}

TheFaithsDecree.code = '13059';

module.exports = TheFaithsDecree;
