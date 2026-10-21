import DrawCard from '../../drawcard.js';

class KingRenlySHost extends DrawCard {
    // King Renly's Host (04063)
    // Intimidate. No attachments.
    // While there is a Summer plot card revealed, King Renly's Host gets +4 STR.
    // While there is a Winter plot card revealed, King Renly's Host cannot be declared as an
    // attacker.
    setupCardAbilities(ability) {
        this.persistentEffect({
            // STR increase while Summer
            condition: () => this.anyPlotHasTrait('Summer'),
            match: this,
            effect: ability.effects.modifyStrength(4)
        });
        this.persistentEffect({
            // cannot attack while Winter
            condition: () => this.anyPlotHasTrait('Winter'),
            match: this,
            effect: ability.effects.cannotBeDeclaredAsAttacker()
        });
    }

    anyPlotHasTrait(trait) {
        return this.game
            .getPlayers()
            .some((player) => player.activePlot && player.activePlot.hasTrait(trait));
    }
}

KingRenlySHost.code = '04063';

export default KingRenlySHost;
