import DrawCard from '../../drawcard.js';

class TridentGuard extends DrawCard {
    // Trident Guard (26011)
    // While your claim value is higher than an opponent's, Trident Guard gains renown.
    setupCardAbilities(ability) {
        this.persistentEffect({
            condition: () =>
                this.game
                    .getPlayers()
                    .some((player) => player.getClaim() < this.controller.getClaim()),
            match: this,
            effect: ability.effects.addKeyword('renown')
        });
    }
}

TridentGuard.code = '26011';

export default TridentGuard;
