const PlotCard = require('../../plotcard.js');

class CondemnedToTheMoonDoor extends PlotCard {
    setupCardAbilities() {
        this.whenRevealed({
            handler: context => {
                this.game.promptForSelect(context.player, {
                    cardCondition: card => card.getType() === 'character' && card.location === 'play area' && !card.hasTrait('Army'),
                    source: this,
                    onSelect: (player, card) => this.onCardSelected(player, card)
                });
            }
        });
    }

    onCardSelected(player, card) {
        this.atEndOfRound(ability => ({
            match: card,
            condition: () => card.location === 'play area',
            targetLocation: 'any',
            effect: ability.effects.killIfStillInPlayAndKneelFactionCard(player, false)
        }));

        this.game.addMessage('{0} chooses {1} for {2}',
            player, card, this);
        return true;
    }
}

CondemnedToTheMoonDoor.code = '23038';

module.exports = CondemnedToTheMoonDoor;
