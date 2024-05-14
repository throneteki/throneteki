const DrawCard = require('../../drawcard.js');

class TheWall extends DrawCard {
    setupCardAbilities(ability) {
        this.persistentEffect({
            match: (card) => card.getType() === 'character',
            effect: [
                ability.effects.loseFaction('stark'),
                ability.effects.loseFaction('lannister'),
                ability.effects.loseFaction('tyrell'),
                ability.effects.loseFaction('martell'),
                ability.effects.loseFaction('targaryen'),
                ability.effects.loseFaction('greyjoy'),
                ability.effects.loseFaction('baratheon'),
                ability.effects.addFaction('thenightswatch')
            ]
        });

        this.action({
            title: 'Take control of character',
            cost: ability.costs.kneelSelf(),
            chooseOpponent: (opponent) =>
                opponent.discardPile.some(
                    (card) => card.getType() === 'character' && this.controller.canPutIntoPlay(card)
                ),
            handler: (context) => {
                this.game.addMessage(
                    '{0} kneels {1} to have {2} select a character from their discard pile to put into play',
                    context.player,
                    this,
                    context.opponent
                );
                this.game.promptForSelect(context.opponent, {
                    source: this,
                    cardCondition: (card) =>
                        card.location === 'discard pile' &&
                        card.controller === context.opponent &&
                        card.getType() === 'character' &&
                        context.player.canPutIntoPlay(card),
                    onSelect: (player, cards) => this.onCardSelected(player, cards),
                    onCancel: (player) => this.cancelSelection(player)
                });
            }
        });
    }

    onCardSelected(player, card) {
        this.controller.putIntoPlay(card);
        this.game.addMessage('{0} chooses {1} for {2}', player, card, this);
        return true;
    }

    cancelSelection(player) {
        this.game.addAlert('danger', '{0} does not select a character for {1}', player, this);
        return true;
    }
}

TheWall.code = '11026';

module.exports = TheWall;
