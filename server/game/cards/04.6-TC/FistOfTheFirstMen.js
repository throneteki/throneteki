import DrawCard from '../../drawcard.js';

class FistOfTheFirstMen extends DrawCard {
    setupCardAbilities(ability) {
        this.persistentEffect({
            condition: () => this.hasHigherReserveThanOpponent(),
            match: (card) => card.getType() === 'character' && card.hasTrait('Ranger'),
            effect: [ability.effects.modifyStrength(1), ability.effects.cannotBeBypassedByStealth()]
        });
    }

    hasHigherReserveThanOpponent() {
        let opponents = this.game.getOpponents(this.controller);
        return opponents.some((opponent) => this.controller.getReserve() > opponent.getReserve());
    }
}

FistOfTheFirstMen.code = '04106';

export default FistOfTheFirstMen;
