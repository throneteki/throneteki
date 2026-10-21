import AgendaCard from '../../agendacard.js';
import GameActions from '../../GameActions/index.js';

class TheHouseWithTheRedDoor extends AgendaCard {
    // The House With the Red Door (08039)
    // After all agendas are announced, search your deck for a non-limited unique location with
    // printed cost 3 or lower and put it into play. That location cannot be discarded from play by
    // card effects.
    // You cannot spend more than 4 gold during setup.
    setupCardAbilities(ability) {
        this.afterAgendasAnnounced({
            message:
                '{player} uses {source} to search their deck for a non-limited unique location with printed cost 3 or lower',
            gameAction: GameActions.search({
                title: 'Select a location',
                match: { type: 'location', limited: false, unique: true, printedCostOrLower: 3 },
                reveal: false,
                message: '{player} {gameAction}',
                gameAction: GameActions.putIntoPlay((context) => ({
                    card: context.searchTarget
                }))
            }).then({
                condition: (context) =>
                    context.parentContext.searchTarget?.location === 'play area',
                gameAction: GameActions.lastingEffect((context) => {
                    const location = context.parentContext.searchTarget;
                    return {
                        duration: 'custom',
                        until: {
                            onCardLeftPlay: (event) => event.card === location
                        },
                        match: location,
                        effect: ability.effects.cannotBeDiscarded(
                            (context) => context.resolutionStage === 'effect'
                        )
                    };
                })
            })
        });

        this.persistentEffect({
            effect: ability.effects.setSetupGold(4)
        });
    }
}

TheHouseWithTheRedDoor.code = '08039';

export default TheHouseWithTheRedDoor;
