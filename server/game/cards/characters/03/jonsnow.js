const DrawCard = require('../../../drawcard.js');

class JonSnow extends DrawCard {
    setupCardAbilities() {
        this.action({
            title: 'Sacrifice character',
            method: 'sacrifice',
            limit: { amount: 1, period: 'round' }
        });
    }

    sacrifice() {
        this.game.promptForSelect(this.controller, {
            activePromptTitle: 'Select a character to sacrifice',
            waitingPromptTitle: 'Waiting for opponent to use ' + this.name,
            cardCondition: card => card.location === 'play area' && card.controller === this.controller && card.getType() === 'character' && card.getFaction() === this.getFaction(),
            onSelect: (p, card) => this.onSacrificeSelected(p, card)
        });        

        return true;
    }

    onSacrificeSelected(player, card) {
        this.toSacrifice = card;

        this.game.promptForSelect(this.controller, {
            activePromptTitle: 'Select a character to stand',
            waitingPromptTitle: 'Waiting for opponent to use ' + this.name,
            cardCondition: card => card.location === 'play area' && card.controller === this.controller && card.getType() === 'character' &&
                card.getFaction() === this.getFaction() && card.isUnique() && card.kneeled,
            onSelect: (p, card) => this.onStandSelected(p, card)
        });

        return true;
    }

    onStandSelected(player, card) {
        this.game.addMessage('{0} uses {1} to sacrifice {2} and stand {3}', player, this, this.toSacrifice, card);

        card.kneeled = false;
        player.sacrificeCard(this.toSacrifice);
        this.toSacrifice.selected = false;

        return true;
    }
}

JonSnow.code = '03005';

module.exports = JonSnow;
