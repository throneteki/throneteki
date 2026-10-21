import AgendaCard from '../../agendacard.js';
import GameActions from '../../GameActions/index.js';

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
        this.game.resolveGameAction(
            GameActions.search({
                title: 'Select a location',
                player: () => this.controller,
                match: { type: 'location', limited: false, unique: true, printedCostOrLower: 3 },
                reveal: false,
                message:
                    '{player} uses {source} to search their deck and put {searchTarget} into play',
                gameAction: GameActions.putIntoPlay((context) => ({
                    player: this.controller,
                    card: context.searchTarget
                })).thenExecute((event) => {
                    this.startLocation = event.card;
                    //Manually set card faceup to override the setup phase default facedown setting
                    event.card.facedown = false;

                    this.controller.cardsInPlayBeforeSetup.push(event.card);
                    this.lastingEffect((ability) => ({
                        until: {
                            onCardLeftPlay: (event) => event.card === this.startLocation
                        },
                        match: (card) => card === this.startLocation,
                        effect: ability.effects.cannotBeDiscarded(
                            (context) => context.resolutionStage === 'effect'
                        )
                    }));
                })
            }),
            context
        );
    }

    // The House With the Red Door (08039)
    // After all agendas are announced, search your deck for a non-limited unique location with
    // printed cost 3 or lower and put it into play. That location cannot be discarded from play by
    // card effects.
    // You cannot spend more than 4 gold during setup.
    setupCardAbilities(ability) {
        this.persistentEffect({
            effect: ability.effects.setSetupGold(4)
        });
    }
}

TheHouseWithTheRedDoor.code = '08039';

export default TheHouseWithTheRedDoor;
