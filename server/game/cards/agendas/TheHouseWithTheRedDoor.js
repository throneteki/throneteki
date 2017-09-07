const AgendaCard = require('../../agendacard.js');

class TheHouseWithTheRedDoor extends AgendaCard {
    constructor(owner, cardData) {
        super(owner, cardData);

        this.registerEvents(['onDecksPrepared']);
    }

    onDecksPrepared() {
        this.game.promptForDeckSearch(this.controller, {
            activePromptTitle: 'Select a location',
            cardCondition: card => card.getType() === 'location' && !card.isLimited() && card.isUnique() && card.getPrintedCost() <= 3,
            onSelect: (player, card) => this.cardSelected(player, card),
            onCancel: player => this.doneSelecting(player),
            source: this
        });
    }

    cardSelected(player, card) {
        this.startLocation = card;
        player.putIntoPlay(card);

        //Manually set card faceup to override the setup phase default facedown setting
        card.facedown = false;

        this.controller.cardsInPlayBeforeSetup.push(card);
        this.game.addMessage('{0} uses {1} to search their deck and put {2} into play', player, this, card);

        this.lastingEffect(ability => ({
            until: {
                onCardLeftPlay: event => event.card === this.startLocation
            },
            match: card => card === this.startLocation,
            effect: ability.effects.cannotBeDiscarded(context => context.stage === 'effect')
        }));
    }

    doneSelecting(player) {
        this.game.addMessage('{0} uses {1} to search their deck, but does not put any card into play', player, this);
    }

    setupCardAbilities(ability) {
        this.persistentEffect({
            targetType: 'player',
            effect: ability.effects.setSetupGold(4)
        });
    }
}

TheHouseWithTheRedDoor.code = '08039';

module.exports = TheHouseWithTheRedDoor;
