import DrawCard from '../../drawcard.js';
import GameActions from '../../GameActions/index.js';

class ThorenSmallwood extends DrawCard {
    // Thoren Smallwood (04045)
    // No attachments except Weapon.
    // Reaction: After you win a challenge as the defending player, gain 1 power for your faction.
    setupCardAbilities() {
        this.reaction({
            when: {
                afterChallenge: (event, context) =>
                    event.challenge.winner === context.source.controller &&
                    !event.challenge.isAttackerTheWinner() &&
                    context.source.controller.canGainFactionPower()
            },
            message:
                '{player} uses {source} to gain 1 power for their faction after winning a challenge as the defending player',
            gameAction: GameActions.gainPower((context) => ({
                card: context.player.faction,
                amount: 1
            }))
        });
    }
}

ThorenSmallwood.code = '04045';

export default ThorenSmallwood;
