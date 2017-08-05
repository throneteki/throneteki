const _ = require('underscore');

const AgendaCard = require('../../agendacard.js');

class Treaty extends AgendaCard {
    constructor(owner, cardData) {
        super(owner, cardData);

        this.registerEvents(['onDecksPrepared']);
    }

    setupCardAbilities(ability) {
        this.action({
            title: 'Draw card then discard card',
            cost: ability.costs.kneelFactionCard(),
            handler: () => {
                this.controller.drawCardsToHand(1);
                this.game.addMessage('0} uses {1} and kneels their faction card to draw 1 card', this.controller, this);
                
                this.game.promptForSelect(this.controller, {
                    activePromptTitle: 'Select a card',
                    source: this,
                    cardCondition: card => card.location === 'hand' && card.controller === this.controller,
                    onSelect: (player, card) => this.cardSelected(player, card)
                });
            }
        });
    }

    cardSelected(player, card) {
        player.discardCard(card);
        this.game.addMessage('{0} then discards {1} for {2}', this.controller, card, this);
        return true;
    }

    onDecksPrepared() {
        let factionsInDecks = [];

        this.controller.allCards.each(card => {
            if(!factionsInDecks.includes(card.getPrintedFaction())) {
                factionsInDecks.push(card.getPrintedFaction());
            }
        });

        let factionsToAnnounce = _.filter(factionsInDecks, faction => faction !== this.controller.getFaction() && faction !== 'neutral');

        if(factionsToAnnounce.length > 2) {
            this.game.addMessage('{0} has included more than the maximum allowed number of factions for {1} in their draw and/or plot deck',
                this.controller, this);
            return;
        }

        if(factionsToAnnounce.length < 2) {
            //This is slightly more problematic than The Power of Wealth. Printing a message here doesn't allow bluffing a second faction,
            //but not printing a message allows possibility to lie.
            return;            
        }

        this.game.addMessage('{0} names {1} as their factions for {2}', this.controller, factionsToAnnounce, this);
    }
}

Treaty.code = '00003';

module.exports = Treaty;
