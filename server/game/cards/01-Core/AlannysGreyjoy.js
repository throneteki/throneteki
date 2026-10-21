import DrawCard from '../../drawcard.js';

class AlannysGreyjoy extends DrawCard {
    // Alannys Greyjoy (01066)
    // While you are the first player, reduce the reserve value on each opponent's revealed plot
    // card by 1.
    setupCardAbilities(ability) {
        this.persistentEffect({
            condition: () => this.controller.firstPlayer,
            match: (card) => card === card.controller.activePlot,
            targetController: 'opponent',
            effect: ability.effects.modifyReserve(-1)
        });
    }
}

AlannysGreyjoy.code = '01066';

export default AlannysGreyjoy;
