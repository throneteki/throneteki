import PlotCard from '../../plotcard.js';

class YourKingCommandsIt extends PlotCard {
    setupCardAbilities(ability) {
        this.persistentEffect({
            match: (card) =>
                card.getType() === 'character' && !card.hasTrait('King') && !card.hasTrait('Queen'),
            targetController: 'any',
            effect: ability.effects.cannotGainPower()
        });
    }
}

YourKingCommandsIt.code = '09048';

export default YourKingCommandsIt;
