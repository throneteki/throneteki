import DrawCard from '../../drawcard.js';

class FistOfTheFirstMen extends DrawCard {
    // Fist of the First Men (04106)
    // While your reserve value is higher than an opponent's, each Ranger character you control gets
    // +1 STR and cannot be bypassed by stealth.
    setupCardAbilities(ability) {
        this.persistentEffect({
            condition: (context) => context.source.hasHigherReserveThanOpponent(),
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
