import DrawCard from '../../drawcard.js';
import TextHelper from '../../TextHelper.js';
import GameActions from '../../GameActions/index.js';

class KingAtTheWall extends DrawCard {
    // King at the Wall (08108)
    // Unique [baratheon] character only.
    // Attached character gains the King trait.
    // Reaction: After you win a [power] challenge in which attached character is participating,
    // draw 1 card for each out-of-faction location you control.
    setupCardAbilities(ability) {
        this.attachmentRestriction({ faction: 'baratheon', unique: true });
        this.whileAttached({
            effect: ability.effects.addTrait('King')
        });

        this.reaction({
            when: {
                afterChallenge: (event, context) =>
                    event.challenge.winner === context.player &&
                    event.challenge.challengeType === 'power' &&
                    !!context.source.parent &&
                    event.challenge.isParticipating(context.source.parent) &&
                    outOfFactionLocations(context) > 0
            },
            message: {
                format: '{player} uses {source} to draw {amount}',
                args: {
                    amount: (context) => TextHelper.count(outOfFactionLocations(context), 'card')
                }
            },
            gameAction: GameActions.drawCards((context) => ({
                player: context.player,
                amount: outOfFactionLocations(context)
            }))
        });
    }
}

function outOfFactionLocations(context) {
    return context.player.getNumberOfCardsInPlay(
        (card) => card.getType() === 'location' && card.isOutOfFaction()
    );
}

KingAtTheWall.code = '08108';

export default KingAtTheWall;
