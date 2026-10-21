import DrawCard from '../../drawcard.js';

class VanguardOfTheNorth extends DrawCard {
    // Vanguard of the North (01151)
    // No attachments.
    // While a player has a War plot revealed, Vanguard of the North does not kneel when declared as
    // an attacker in a [military] challenge.
    setupCardAbilities(ability) {
        this.persistentEffect({
            condition: () =>
                this.game
                    .getPlayers()
                    .some((player) => player.activePlot && player.activePlot.hasTrait('War')),
            match: this,
            effect: ability.effects.doesNotKneelAsAttacker({ challengeType: 'military' })
        });
    }
}

VanguardOfTheNorth.code = '01151';

export default VanguardOfTheNorth;
