import DrawCard from '../../drawcard.js';
import GameActions from '../../GameActions/index.js';

class SerPrestonGreenfield extends DrawCard {
    // Ser Preston Greenfield (13087)
    // Shadow (4).
    // Reaction: After you win a challenge in which Ser Preston Greenfield is participating, the
    // losing opponent must move 1 power from his or her faction card to a standing character he or
    // she controls.
    setupCardAbilities() {
        this.reaction({
            when: {
                afterChallenge: (event, context) =>
                    event.challenge.winner === context.player &&
                    context.source.isParticipating() &&
                    event.challenge.loser.faction.power > 0
            },
            message: {
                format: '{player} uses {source} to have {loser} move 1 power from their faction card to a standing character they control',
                args: { loser: (context) => context.event.challenge.loser }
            },
            gameAction: GameActions.chooseCards({
                player: (context) => context.event.challenge.loser,
                title: 'Select a character',
                cardCondition: (card, context) =>
                    card.location === 'play area' &&
                    card.getType() === 'character' &&
                    !card.kneeled &&
                    card.controller === context.choosingPlayer,
                gameAction: (card) =>
                    GameActions.movePower({ from: card.controller.faction, to: card })
            })
        });
    }
}

SerPrestonGreenfield.code = '13087';

export default SerPrestonGreenfield;
