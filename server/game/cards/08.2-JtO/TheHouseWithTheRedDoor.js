const AgendaCard = require('../../agendacard.js');
const GameActions = require('../../GameActions/index.js');

class TheHouseWithTheRedDoor extends AgendaCard {
    constructor(owner, cardData) {
        super(owner, cardData);

        this.registerEvents(['onDecksPrepared']);
    }

    onDecksPrepared() {
        const context = {
            player: this.controller,
            game: this.game,
            source: this
        };
        this.game.resolveGameAction(GameActions.search({
            title: 'Select a location',
            player: () => this.controller,
            match: { type: 'location', limited: false, unique: true, printedCostOrLower: 3 },
            reveal: false,
            message: '{player} uses {source} to search their deck and put {searchTarget} into play',
            gameAction: GameActions.putIntoPlay(context => ({
                player: this.controller,
                card: context.searchTarget
            })).thenExecute(event => {
                this.startLocation = event.card;
                //Manually set card faceup to override the setup phase default facedown setting
                event.card.facedown = false;

                this.controller.cardsInPlayBeforeSetup.push(event.card);
                this.lastingEffect(ability => ({
                    until: {
                        onCardLeftPlay: event => event.card === this.startLocation
                    },
                    match: card => card === this.startLocation,
                    effect: ability.effects.cannotBeDiscarded(context => context.resolutionStage === 'effect')
                }));
            })
        }), context);
    }

    setupCardAbilities(ability) {
        this.persistentEffect({
            effect: ability.effects.setSetupGold(4)
        });
    }
}

TheHouseWithTheRedDoor.code = '08039';

module.exports = TheHouseWithTheRedDoor;
