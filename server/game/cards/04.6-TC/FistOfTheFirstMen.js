import DrawCard from '../../drawcard.js';

function hasHigherReserveThanOpponent(source) {
    let opponents = source.game.getOpponents(source.controller);
    return opponents.some((opponent) => source.controller.getReserve() > opponent.getReserve());
}

class FistOfTheFirstMen extends DrawCard {
    // Fist of the First Men (04106)
    // While your reserve value is higher than an opponent's, each Ranger character you control gets
    // +1 STR and cannot be bypassed by stealth.
    setupCardAbilities(ability) {
        this.persistentEffect({
            condition: (context) => hasHigherReserveThanOpponent(context.source),
            match: (card) => card.getType() === 'character' && card.hasTrait('Ranger'),
            effect: [ability.effects.modifyStrength(1), ability.effects.cannotBeBypassedByStealth()]
        });
    }
}

FistOfTheFirstMen.code = '04106';

export default FistOfTheFirstMen;
