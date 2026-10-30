import DrawCard from '../../drawcard.js';
import GameActions from '../../GameActions/index.js';

class Oldtown extends DrawCard {
    // Oldtown (08024)
    // Action: Kneel Oldtown to name a cardtype (character, location, attachment, or event). Then,
    // reveal the top card of your deck. If the revealed card has that cardtype, draw it and gain 1
    // power for your faction.
    setupCardAbilities(ability) {
        this.action({
            title: 'Reveal top card of deck',
            cost: ability.costs.kneelSelf(),
            message: '{player} uses and kneels {source} to name a cardtype',
            gameAction: GameActions.choose({
                title: 'Select a card type',
                message: '{choosingPlayer} names the {choice} cardtype',
                choices: {
                    Character: this.revealGameActionForCardtype('Character'),
                    Location: this.revealGameActionForCardtype('Location'),
                    Attachment: this.revealGameActionForCardtype('Attachment'),
                    Event: this.revealGameActionForCardtype('Event')
                }
            })
        });
    }

    revealGameActionForCardtype(cardType) {
        return GameActions.revealTopCards((context) => ({
            player: context.player
        })).then({
            message: '{player} {gameAction}',
            gameAction: GameActions.ifCondition({
                condition: (context) => context.event.cards[0].getType() === cardType.toLowerCase(),
                thenAction: GameActions.simultaneously([
                    GameActions.drawSpecific((context) => ({
                        player: context.player,
                        cards: context.parentContext.revealed
                    })),
                    GameActions.gainPower((context) => ({
                        card: context.player.faction,
                        amount: 1
                    }))
                ])
            })
        });
    }
}

Oldtown.code = '08024';

export default Oldtown;
